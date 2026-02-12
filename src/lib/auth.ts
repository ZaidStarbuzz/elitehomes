import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import type { SessionUser } from "@/types";
import type { UserRole } from "@prisma/client";

export async function getSession(): Promise<SessionUser | null> {
  const supabase = await createClient();
  const {
    data: { user: supabaseUser },
  } = await supabase.auth.getUser();

  console.log(supabaseUser, "supabaseUser");
  if (!supabaseUser) return null;

  const user = await db.user.findUnique({
    where: { supabaseId: supabaseUser.id },
    select: {
      id: true,
      supabaseId: true,
      email: true,
      name: true,
      role: true,
      avatar: true,
    },
  });
  console.log(user);

  return user;
}

export async function requireAuth(): Promise<SessionUser> {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  return session;
}

export async function requireRole(roles: UserRole[]): Promise<SessionUser> {
  const session = await requireAuth();
  if (!roles.includes(session.role)) {
    redirect("/unauthorized");
  }
  return session;
}

export async function requireHostelAccess(
  hostelId: string,
): Promise<SessionUser> {
  const session = await requireAuth();

  if (session.role === "SUPER_ADMIN") return session;

  // Check if user is admin of this hostel
  const hostel = await db.hostel.findFirst({
    where: {
      id: hostelId,
      OR: [
        { adminId: session.id },
        {
          members: {
            some: {
              userId: session.id,
              isActive: true,
            },
          },
        },
      ],
    },
  });

  if (!hostel) {
    redirect("/unauthorized");
  }

  return session;
}

export function generateBookingNumber(): string {
  const prefix = "BK";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

export function generateTicketNumber(): string {
  const prefix = "TK";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}
