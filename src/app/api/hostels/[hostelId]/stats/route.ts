import { db } from "@/lib/db";
import { withHostelAccess, successResponse } from "@/lib/api-utils";
import type { DashboardStats } from "@/types";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ hostelId: string }> }
) {
  const { hostelId } = await params;

  return withHostelAccess(hostelId, async () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const [
      totalRooms,
      totalBeds,
      occupiedBeds,
      availableBeds,
      activeBookings,
      pendingBookings,
      openComplaints,
      totalEmployees,
      monthlyIncome,
      monthlyExpenses,
    ] = await Promise.all([
      db.room.count({ where: { hostelId, isActive: true } }),
      db.bed.count({ where: { hostelId, isActive: true } }),
      db.bed.count({ where: { hostelId, isActive: true, status: "OCCUPIED" } }),
      db.bed.count({
        where: { hostelId, isActive: true, status: "AVAILABLE" },
      }),
      db.booking.count({
        where: { hostelId, status: "CHECKED_IN" },
      }),
      db.booking.count({
        where: { hostelId, status: "PENDING" },
      }),
      db.complaint.count({
        where: {
          hostelId,
          status: { in: ["OPEN", "IN_PROGRESS"] },
        },
      }),
      db.employee.count({ where: { hostelId, isActive: true } }),
      db.transaction.aggregate({
        where: {
          hostelId,
          type: "INCOME",
          paymentStatus: "COMPLETED",
          date: { gte: startOfMonth, lte: endOfMonth },
        },
        _sum: { amount: true },
      }),
      db.transaction.aggregate({
        where: {
          hostelId,
          type: "EXPENSE",
          paymentStatus: "COMPLETED",
          date: { gte: startOfMonth, lte: endOfMonth },
        },
        _sum: { amount: true },
      }),
    ]);

    const totalGuests = activeBookings;
    const occupancyRate =
      totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

    const stats: DashboardStats = {
      totalRooms,
      totalBeds,
      occupiedBeds,
      availableBeds,
      occupancyRate,
      totalGuests,
      activeBookings,
      pendingBookings,
      openComplaints,
      monthlyRevenue: Number(monthlyIncome._sum.amount || 0),
      monthlyExpenses: Number(monthlyExpenses._sum.amount || 0),
      totalEmployees,
    };

    return successResponse(stats);
  });
}
