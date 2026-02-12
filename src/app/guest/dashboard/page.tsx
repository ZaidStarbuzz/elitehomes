import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  BedDouble,
  CalendarCheck,
  MessageSquareWarning,
  User,
} from "lucide-react";
import {
  BOOKING_STATUS_COLORS,
  COMPLAINT_STATUS_COLORS,
} from "@/lib/constants";

export default async function GuestDashboardPage() {
  const session = await requireAuth();

  const [activeBooking, recentComplaints] = await Promise.all([
    db.booking.findFirst({
      where: {
        guestId: session.id,
        status: { in: ["CHECKED_IN", "APPROVED", "PENDING"] },
      },
      include: {
        hostel: true,
        bed: {
          include: {
            room: {
              include: {
                floor: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    db.complaint.findMany({
      where: { authorId: session.id },
      take: 3,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const quickActions = [
    {
      title: "Browse Rooms",
      description: "Find available rooms and hostels",
      href: "/guest/rooms",
      icon: BedDouble,
    },
    {
      title: "My Bookings",
      description: "View your booking history",
      href: "/guest/bookings",
      icon: CalendarCheck,
    },
    {
      title: "Submit Complaint",
      description: "Report an issue or concern",
      href: "/guest/complaints",
      icon: MessageSquareWarning,
    },
    {
      title: "My Profile",
      description: "Update your personal details",
      href: "/guest/profile",
      icon: User,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {session.name}
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s an overview of your guest portal.
        </p>
      </div>

      {/* Active Booking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarCheck className="size-5" />
            Active Booking
          </CardTitle>
          <CardDescription>Your current stay details</CardDescription>
        </CardHeader>
        <CardContent>
          {activeBooking ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Booking #</span>
                <span className="text-sm">{activeBooking.bookingNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Hostel</span>
                <span className="text-sm">{activeBooking.hostel.name}</span>
              </div>
              {activeBooking.bed && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Room</span>
                    <span className="text-sm">
                      {activeBooking.bed.room.roomNumber} (Floor{" "}
                      {activeBooking.bed.room.floor.floorNumber})
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Bed</span>
                    <span className="text-sm">
                      {activeBooking.bed.bedNumber}
                    </span>
                  </div>
                </>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status</span>
                <Badge
                  className={
                    BOOKING_STATUS_COLORS[activeBooking.status] || ""
                  }
                  variant="secondary"
                >
                  {activeBooking.status.replace("_", " ")}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Monthly Rent</span>
                <span className="text-sm font-semibold">
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                  }).format(Number(activeBooking.monthlyRent))}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              You don&apos;t have any active bookings.{" "}
              <Link
                href="/guest/rooms"
                className="text-primary hover:underline"
              >
                Browse available rooms
              </Link>
            </p>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <Card className="h-full transition-colors hover:bg-muted/50 cursor-pointer">
                <CardContent className="flex flex-col items-center text-center pt-6">
                  <action.icon className="size-8 mb-3 text-primary" />
                  <h3 className="font-semibold">{action.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {action.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Complaints */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquareWarning className="size-5" />
            Recent Complaints
          </CardTitle>
          <CardDescription>Your latest submitted complaints</CardDescription>
        </CardHeader>
        <CardContent>
          {recentComplaints.length > 0 ? (
            <div className="space-y-4">
              {recentComplaints.map((complaint) => (
                <div
                  key={complaint.id}
                  className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{complaint.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {complaint.ticketNumber} &middot; {complaint.category}
                    </p>
                  </div>
                  <Badge
                    className={
                      COMPLAINT_STATUS_COLORS[complaint.status] || ""
                    }
                    variant="secondary"
                  >
                    {complaint.status.replace("_", " ")}
                  </Badge>
                </div>
              ))}
              <div className="pt-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/guest/complaints">View all complaints</Link>
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No complaints submitted yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
