import { requireRole } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import {
  Building2,
  Plus,
  BedDouble,
  Users,
  CalendarCheck,
  MessageSquareWarning,
  IndianRupee,
  TrendingUp,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { OccupancyChart } from "@/components/dashboard/occupancy-chart";
import type { DashboardStats } from "@/types";

async function getDashboardStats(hostelId: string): Promise<DashboardStats> {
  const [
    totalRooms,
    totalBeds,
    occupiedBeds,
    activeBookings,
    pendingBookings,
    openComplaints,
    totalEmployees,
    monthlyRevenue,
    monthlyExpenses,
  ] = await Promise.all([
    db.room.count({ where: { hostelId, isActive: true } }),
    db.bed.count({ where: { hostelId, isActive: true } }),
    db.bed.count({ where: { hostelId, isActive: true, status: "OCCUPIED" } }),
    db.booking.count({
      where: {
        hostelId,
        status: { in: ["APPROVED", "CHECKED_IN"] },
      },
    }),
    db.booking.count({
      where: { hostelId, status: "PENDING" },
    }),
    db.complaint.count({
      where: { hostelId, status: { in: ["OPEN", "IN_PROGRESS"] } },
    }),
    db.employee.count({ where: { hostelId, isActive: true } }),
    db.transaction.aggregate({
      where: {
        hostelId,
        type: "INCOME",
        paymentStatus: "COMPLETED",
        date: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
      _sum: { amount: true },
    }),
    db.transaction.aggregate({
      where: {
        hostelId,
        type: "EXPENSE",
        paymentStatus: "COMPLETED",
        date: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
      _sum: { amount: true },
    }),
  ]);

  const availableBeds = totalBeds - occupiedBeds;
  const occupancyRate = totalBeds > 0 ? (occupiedBeds / totalBeds) * 100 : 0;

  return {
    totalRooms,
    totalBeds,
    occupiedBeds,
    availableBeds,
    occupancyRate: Math.round(occupancyRate * 10) / 10,
    totalGuests: activeBookings,
    activeBookings,
    pendingBookings,
    openComplaints,
    monthlyRevenue: Number(monthlyRevenue._sum.amount ?? 0),
    monthlyExpenses: Number(monthlyExpenses._sum.amount ?? 0),
    totalEmployees,
  };
}

export default async function DashboardPage() {
  const session = await requireRole(["HOSTEL_ADMIN", "SUPER_ADMIN"]);

  const hostels = await db.hostel.findMany({
    where: { adminId: session.id, isActive: true },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          rooms: true,
          beds: true,
          bookings: true,
          employees: true,
        },
      },
    },
  });

  // No hostels - show welcome screen
  if (hostels.length === 0) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome to EliteHomes Management
            </p>
          </div>
        </div>

        <Card className="mx-auto max-w-lg text-center">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Welcome to EliteHomes!</CardTitle>
            <CardDescription className="text-base">
              Get started by creating your first hostel. You can manage rooms,
              bookings, tenants, and more from your dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/hostels/new">
              <Button size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                Create Your First Hostel
              </Button>
            </Link>
          </CardContent>
        </Card>

        <div className="mx-auto grid max-w-3xl gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <BedDouble className="h-5 w-5" />
              </div>
              <CardTitle className="text-sm">Manage Rooms & Beds</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Create floors, rooms, and beds. Track availability and
                occupancy in real time.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600">
                <CalendarCheck className="h-5 w-5" />
              </div>
              <CardTitle className="text-sm">Handle Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Accept booking requests, manage check-ins and check-outs,
                and track payments.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                <IndianRupee className="h-5 w-5" />
              </div>
              <CardTitle className="text-sm">Track Finances</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Monitor income and expenses, generate reports, and keep
                your books organized.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // User has hostels - show dashboard with stats
  const selectedHostel = hostels[0];
  const stats = await getDashboardStats(selectedHostel.id);

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your hostel management
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/hostels/new">
            <Button variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              New Hostel
            </Button>
          </Link>
        </div>
      </div>

      {/* Hostel Selector */}
      {hostels.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Your Hostels
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {hostels.map((hostel) => (
                <Link
                  key={hostel.id}
                  href={`/admin/hostels/${hostel.id}`}
                >
                  <Badge
                    variant={
                      hostel.id === selectedHostel.id ? "default" : "outline"
                    }
                    className="cursor-pointer gap-1.5 px-3 py-1.5 text-sm"
                  >
                    <Building2 className="h-3.5 w-3.5" />
                    {hostel.name}
                  </Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Hostel Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>{selectedHostel.name}</CardTitle>
                <CardDescription>
                  {selectedHostel.city}, {selectedHostel.state}
                </CardDescription>
              </div>
            </div>
            <Link href={`/admin/hostels/${selectedHostel.id}`}>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="flex items-center gap-2">
              <BedDouble className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">
                  {selectedHostel._count.rooms}
                </p>
                <p className="text-xs text-muted-foreground">Rooms</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <BedDouble className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">
                  {selectedHostel._count.beds}
                </p>
                <p className="text-xs text-muted-foreground">Beds</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CalendarCheck className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">
                  {selectedHostel._count.bookings}
                </p>
                <p className="text-xs text-muted-foreground">Bookings</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">
                  {selectedHostel._count.employees}
                </p>
                <p className="text-xs text-muted-foreground">Employees</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Occupancy Chart */}
      <OccupancyChart stats={stats} />

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link href={`/admin/hostels/${selectedHostel.id}`}>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Building2 className="h-4 w-4" />
                Manage Hostel
              </Button>
            </Link>
            <Link href={`/admin/hostels/${selectedHostel.id}/bookings`}>
              <Button variant="outline" className="w-full justify-start gap-2">
                <CalendarCheck className="h-4 w-4" />
                View Bookings
                {stats.pendingBookings > 0 && (
                  <Badge variant="secondary" className="ml-auto">
                    {stats.pendingBookings}
                  </Badge>
                )}
              </Button>
            </Link>
            <Link href={`/admin/hostels/${selectedHostel.id}/complaints`}>
              <Button variant="outline" className="w-full justify-start gap-2">
                <MessageSquareWarning className="h-4 w-4" />
                Complaints
                {stats.openComplaints > 0 && (
                  <Badge variant="destructive" className="ml-auto">
                    {stats.openComplaints}
                  </Badge>
                )}
              </Button>
            </Link>
            <Link href={`/admin/hostels/${selectedHostel.id}/transactions`}>
              <Button variant="outline" className="w-full justify-start gap-2">
                <IndianRupee className="h-4 w-4" />
                Transactions
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
