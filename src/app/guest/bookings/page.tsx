import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BOOKING_STATUS_COLORS } from "@/lib/constants";
import { format } from "date-fns";
import { CalendarCheck } from "lucide-react";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
}

export default async function GuestBookingsPage() {
  const session = await requireAuth();

  const bookings = await db.booking.findMany({
    where: { guestId: session.id },
    include: {
      hostel: {
        select: { id: true, name: true, city: true },
      },
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
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Bookings</h1>
        <p className="text-muted-foreground">
          View and track all your booking requests.
        </p>
      </div>

      {bookings.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <CalendarCheck className="mx-auto size-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No Bookings Yet</h3>
            <p className="text-sm text-muted-foreground mt-1">
              You haven&apos;t made any booking requests yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bookings.map((booking) => (
            <Card key={booking.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-base">
                  <span>{booking.bookingNumber}</span>
                  <Badge
                    className={BOOKING_STATUS_COLORS[booking.status] || ""}
                    variant="secondary"
                  >
                    {booking.status.replace("_", " ")}
                  </Badge>
                </CardTitle>
                <CardDescription>{booking.hostel.name}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {booking.hostel.city && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">City</span>
                    <span>{booking.hostel.city}</span>
                  </div>
                )}

                {booking.bed && (
                  <>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Room</span>
                      <span>
                        {booking.bed.room.roomNumber} (Floor{" "}
                        {booking.bed.room.floor.floorNumber})
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Bed</span>
                      <span>{booking.bed.bedNumber}</span>
                    </div>
                  </>
                )}

                {booking.checkInDate && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Check-in</span>
                  <span>
                    {format(new Date(booking.checkInDate), "MMM dd, yyyy")}
                  </span>
                </div>
                )}

                {booking.checkOutDate && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Check-out</span>
                    <span>
                      {format(
                        new Date(booking.checkOutDate),
                        "MMM dd, yyyy"
                      )}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm border-t pt-2 mt-2">
                  <span className="text-muted-foreground">Monthly Rent</span>
                  <span className="font-semibold">
                    {formatCurrency(Number(booking.monthlyRent))}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Booked On</span>
                  <span>
                    {format(new Date(booking.createdAt), "MMM dd, yyyy")}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
