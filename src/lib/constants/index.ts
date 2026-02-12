export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "EliteHomes";
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const ROOM_TYPE_LABELS: Record<string, string> = {
  SINGLE: "Single",
  DOUBLE: "2-Sharing",
  TRIPLE: "3-Sharing",
  QUAD: "4-Sharing",
  DORMITORY: "Dormitory",
};

export const ROOM_TYPE_CAPACITY: Record<string, number> = {
  SINGLE: 1,
  DOUBLE: 2,
  TRIPLE: 3,
  QUAD: 4,
  DORMITORY: 8,
};

export const BOOKING_STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-blue-100 text-blue-800",
  REJECTED: "bg-red-100 text-red-800",
  CHECKED_IN: "bg-green-100 text-green-800",
  CHECKED_OUT: "bg-gray-100 text-gray-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export const COMPLAINT_STATUS_COLORS: Record<string, string> = {
  OPEN: "bg-red-100 text-red-800",
  IN_PROGRESS: "bg-yellow-100 text-yellow-800",
  RESOLVED: "bg-green-100 text-green-800",
  CLOSED: "bg-gray-100 text-gray-800",
};

export const COMPLAINT_PRIORITY_COLORS: Record<string, string> = {
  LOW: "bg-blue-100 text-blue-800",
  MEDIUM: "bg-yellow-100 text-yellow-800",
  HIGH: "bg-orange-100 text-orange-800",
  URGENT: "bg-red-100 text-red-800",
};

export const BED_STATUS_COLORS: Record<string, string> = {
  AVAILABLE: "bg-green-100 text-green-800",
  OCCUPIED: "bg-red-100 text-red-800",
  RESERVED: "bg-yellow-100 text-yellow-800",
  MAINTENANCE: "bg-gray-100 text-gray-800",
};

export const DEFAULT_AMENITIES = [
  "WiFi",
  "AC",
  "Hot Water",
  "Laundry",
  "Parking",
  "Kitchen",
  "TV Room",
  "Gym",
  "Study Room",
  "CCTV",
  "Security",
  "Power Backup",
  "Water Purifier",
  "Mess/Canteen",
  "Elevator",
];

export const PAGINATION_LIMIT = 10;
