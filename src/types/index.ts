import type {
  User,
  Hostel,
  Floor,
  Room,
  Bed,
  Booking,
  Complaint,
  Employee,
  Transaction,
  Announcement,
  HostelMember,
  UserRole,
  RoomType,
  RoomStatus,
  BedStatus,
  BookingStatus,
  ComplaintStatus,
  ComplaintPriority,
  ComplaintCategory,
  TransactionType,
  TransactionCategory,
  PaymentStatus,
  EmployeeRole,
  Gender,
} from "@prisma/client";

// Re-export Prisma types
export type {
  User,
  Hostel,
  Floor,
  Room,
  Bed,
  Booking,
  Complaint,
  Employee,
  Transaction,
  Announcement,
  HostelMember,
};

// Re-export enums
export {
  UserRole,
  RoomType,
  RoomStatus,
  BedStatus,
  BookingStatus,
  ComplaintStatus,
  ComplaintPriority,
  ComplaintCategory,
  TransactionType,
  TransactionCategory,
  PaymentStatus,
  EmployeeRole,
  Gender,
} from "@prisma/client";

// Extended types with relations
export type HostelWithRelations = Hostel & {
  admin: User;
  floors: Floor[];
  rooms: RoomWithRelations[];
  _count?: {
    rooms: number;
    beds: number;
    bookings: number;
    employees: number;
  };
};

export type RoomWithRelations = Room & {
  floor: Floor;
  beds: Bed[];
  _count?: {
    beds: number;
  };
};

export type BedWithRelations = Bed & {
  room: Room & {
    floor: Floor;
  };
  bookings: Booking[];
};

export type BookingWithRelations = Booking & {
  guest: User;
  bed: BedWithRelations | null;
  hostel: Hostel;
  transactions: Transaction[];
};

export type ComplaintWithRelations = Complaint & {
  author: User;
  assignee: User | null;
  hostel: Hostel;
};

export type EmployeeWithRelations = Employee & {
  user: User;
  hostel: Hostel;
};

export type TransactionWithRelations = Transaction & {
  hostel: Hostel;
  booking: Booking | null;
};

// API response types
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export type PaginatedResponse<T> = ApiResponse<T> & {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

// Dashboard stats
export type DashboardStats = {
  totalRooms: number;
  totalBeds: number;
  occupiedBeds: number;
  availableBeds: number;
  occupancyRate: number;
  totalGuests: number;
  activeBookings: number;
  pendingBookings: number;
  openComplaints: number;
  monthlyRevenue: number;
  monthlyExpenses: number;
  totalEmployees: number;
};

// Session user type
export type SessionUser = {
  id: string;
  supabaseId: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string | null;
};

// Navigation types
export type NavItem = {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  children?: NavItem[];
  roles?: UserRole[];
};
