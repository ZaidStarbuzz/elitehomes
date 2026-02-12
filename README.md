# EliteHomes - Multi-Tenant Hostel Management System

A production-ready, scalable, multi-tenant Hostel Management SaaS platform built with Next.js 16, TypeScript, Supabase, and Prisma.

## Architecture Overview

### Tech Stack

| Layer | Technology | Justification |
|-------|-----------|---------------|
| **Framework** | Next.js 16 (App Router) | Server components, server actions, streaming, RSC for performance |
| **Language** | TypeScript | Type safety across the full stack |
| **Styling** | TailwindCSS v4 + shadcn/ui | Rapid UI development with consistent design system |
| **ORM** | Prisma | Type-safe database access, migrations, seeding |
| **Database** | PostgreSQL (Supabase) | Robust relational DB with row-level security |
| **Auth** | Supabase Auth | Session management, OAuth support, SSR-compatible |
| **Storage** | Supabase Storage | File uploads (future: ID documents, images) |
| **Deployment** | Vercel + Supabase | Zero-config deployment with edge functions |

### Multi-Tenant Strategy

**Shared Database with Tenant Column Isolation**

- All tables include a `hostel_id` foreign key for tenant scoping
- Every query is filtered by the authenticated user's hostel access
- API guards enforce hostel-level isolation at the middleware layer
- `HostelMember` junction table controls user-hostel access

This approach was chosen over schema-per-tenant because:
- Simpler operations (single migration, single connection pool)
- Better for SaaS with many small tenants
- Easy cross-tenant analytics for super admins
- Lower infrastructure cost

### Folder Structure

```
elitehomes/
├── prisma/
│   ├── schema.prisma          # Database schema with all models
│   └── seed.ts                # Seed script with sample data
├── src/
│   ├── app/
│   │   ├── (public)/          # Marketing / landing page
│   │   ├── (auth)/            # Authentication pages
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── forgot-password/
│   │   ├── (admin)/           # Admin dashboard (route group)
│   │   │   ├── dashboard/
│   │   │   └── hostels/
│   │   │       └── [hostelId]/
│   │   │           ├── floors/
│   │   │           ├── rooms/
│   │   │           ├── beds/
│   │   │           ├── guests/
│   │   │           ├── bookings/
│   │   │           ├── complaints/
│   │   │           ├── employees/
│   │   │           ├── finance/
│   │   │           └── settings/
│   │   ├── (guest)/           # Guest portal (route group)
│   │   │   ├── dashboard/
│   │   │   ├── rooms/
│   │   │   ├── bookings/
│   │   │   ├── complaints/
│   │   │   ├── payments/
│   │   │   └── profile/
│   │   └── api/               # REST API routes
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   ├── layout/            # Sidebars, headers
│   │   ├── forms/             # Form components
│   │   ├── dashboard/         # Dashboard widgets
│   │   └── admin/             # Admin-specific components
│   ├── lib/
│   │   ├── supabase/          # Client/server/middleware
│   │   ├── db/                # Prisma client singleton
│   │   ├── actions/           # Server actions
│   │   ├── validations/       # Zod schemas
│   │   ├── constants/         # App constants
│   │   ├── auth.ts            # Auth helpers and guards
│   │   └── api-utils.ts       # API response helpers
│   └── types/                 # TypeScript type definitions
├── .env.example               # Environment template
└── package.json
```

## Database Schema

```
Users ──< HostelMembers >── Hostels
  │                            │
  ├──< Employees >─────────────┤
  ├──< Complaints >────────────┤
  ├──< Bookings >──────────────┤
  │       │                    │
  │   Transactions             ├── Floors
  │                            │      │
  │                            │   Rooms
  │                            │      │
  │                            └── Beds
  │                                  │
  └────────── Bookings ──────────────┘
```

### Key Models

- **User**: Multi-role (Super Admin, Hostel Admin, Staff, Guest)
- **Hostel**: Tenant entity with isolated data
- **HostelMember**: User-hostel access mapping
- **Floor → Room → Bed**: Infrastructure hierarchy
- **Booking**: Full lifecycle (Pending → Approved → Checked In → Checked Out)
- **Complaint**: Issue tracking with assignment and resolution
- **Employee**: Staff management with role/salary
- **Transaction**: Income/expense tracking per hostel

## API Design

### REST Endpoints

| Method | Endpoint | Auth |
|--------|----------|------|
| GET | `/api/hostels` | Admin |
| GET | `/api/hostels/[id]` | Admin |
| GET | `/api/hostels/[id]/floors` | Admin |
| GET | `/api/hostels/[id]/rooms` | Admin |
| GET | `/api/hostels/[id]/beds` | Admin |
| GET | `/api/hostels/[id]/bookings` | Admin |
| GET | `/api/hostels/[id]/complaints` | Admin |
| GET | `/api/hostels/[id]/employees` | Admin |
| GET | `/api/hostels/[id]/transactions` | Admin |
| GET | `/api/hostels/[id]/stats` | Admin |
| GET | `/api/bookings` | Guest |
| GET | `/api/complaints` | Guest |
| GET/PATCH | `/api/profile` | Any |

### Server Actions

Auth, hostel CRUD, room/floor/bed management, booking lifecycle, complaint handling, employee management, financial transactions.

## Local Setup

### Prerequisites

- Node.js 18+
- Supabase account (free tier works)

### 1. Install

```bash
git clone <repo-url>
cd elitehomes
npm install
```

### 2. Supabase Setup

1. Create project at [supabase.com](https://supabase.com)
2. Copy Project URL, Anon key, Service role key from Settings → API
3. Copy connection strings from Settings → Database

### 3. Environment

```bash
cp .env.example .env.local
```

Update with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL="postgresql://postgres:PASSWORD@db.REF.supabase.co:5432/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:PASSWORD@db.REF.supabase.co:5432/postgres"
```

### 4. Database

```bash
npm run db:generate    # Generate Prisma client
npm run db:push        # Push schema to database
npm run db:seed        # Seed sample data
npm run db:studio      # (Optional) Open Prisma Studio
```

### 5. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deployment

### Vercel

1. Push to GitHub
2. Import repository on [vercel.com](https://vercel.com)
3. Add environment variables
4. Deploy (auto-detects Next.js)

### Post-Deploy

- Run `npx prisma migrate deploy` for production migrations
- Update Supabase Auth redirect URLs to your domain
- Enable RLS policies on Supabase tables

## Security

- **RBAC**: 4 roles with granular permissions
- **Tenant Isolation**: All queries scoped by hostel membership
- **Server-Side Auth**: Supabase SSR with cookie sessions
- **API Guards**: `withAuth`, `withRole`, `withHostelAccess`
- **Input Validation**: Zod schemas on all mutations
- **Middleware Protection**: Route-level auth checks

## MVP Roadmap

### Phase 1 - Core (Current)
- [x] Multi-hostel management
- [x] Floor/room/bed infrastructure
- [x] Guest booking lifecycle
- [x] Complaint management
- [x] Employee management
- [x] Financial tracking
- [x] Admin dashboard
- [x] Guest self-service portal

### Phase 2 - Enhanced
- [ ] Payment gateway (Razorpay/Stripe)
- [ ] Email/SMS notifications
- [ ] Staff task management
- [ ] Inventory management

### Phase 3 - SaaS
- [ ] Self-service onboarding
- [ ] Subscription billing
- [ ] Platform analytics
- [ ] Mobile app

## Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to DB
npm run db:migrate   # Run migrations
npm run db:seed      # Seed data
npm run db:studio    # Prisma Studio
npm run db:reset     # Reset database
```

## Key Assumptions

1. **India-focused**: Default currency INR, Indian address format
2. **Bed-level booking**: Guests book beds, not rooms (PG/hostel model)
3. **Admin-approved bookings**: No instant booking (requires approval)
4. **Monthly rent model**: Recurring monthly fees, not nightly rates
5. **Shared DB**: Column-level tenant isolation (not schema-per-tenant)
# elitehomes
