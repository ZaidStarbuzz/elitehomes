import { requireHostelAccess } from "@/lib/auth";
import { db } from "@/lib/db";
import { format } from "date-fns";
import { BOOKING_STATUS_COLORS } from "@/lib/constants";
import { CalendarCheck } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BookingActions } from "@/components/admin/booking-actions";

export default async function BookingsPage({
  params,
}: {
  params: Promise<{ hostelId: string }>;
}) {
  const { hostelId } = await params;
  await requireHostelAccess(hostelId);

  const bookings = await db.booking.findMany({
    where: { hostelId },
    include: {
      guest: {
        select: { id: true, name: true, email: true, phone: true },
      },
      bed: {
        include: {
          room: {
            include: { floor: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CalendarCheck className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Bookings</h1>
            <p className="text-muted-foreground">
              Manage all bookings for this hostel
            </p>
          </div>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <CalendarCheck className="h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">No bookings yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Bookings will appear here when guests make reservations.
          </p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking #</TableHead>
                <TableHead>Guest</TableHead>
                <TableHead>Bed / Room</TableHead>
                <TableHead>Check-in</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Monthly Rent</TableHead>
                <TableHead className="w-[50px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">
                    {booking.bookingNumber}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{booking.guest.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {booking.guest.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {booking.bed ? (
                      <div>
                        <p className="font-medium">
                          Bed {booking.bed.bedNumber}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Room {booking.bed.room.roomNumber}
                          {booking.bed.room.floor &&
                            ` - ${booking.bed.room.floor.name}`}
                        </p>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {booking.checkInDate
                      ? format(new Date(booking.checkInDate), "MMM dd, yyyy")
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        BOOKING_STATUS_COLORS[booking.status] ||
                        "bg-gray-100 text-gray-800"
                      }
                      variant="secondary"
                    >
                      {booking.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                    }).format(Number(booking.monthlyRent))}
                  </TableCell>
                  <TableCell>
                    <BookingActions
                      hostelId={hostelId}
                      bookingId={booking.id}
                      status={booking.status}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
