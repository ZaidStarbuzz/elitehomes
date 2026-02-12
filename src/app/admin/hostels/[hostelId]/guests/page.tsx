import { requireHostelAccess } from "@/lib/auth";
import { db } from "@/lib/db";
import { format } from "date-fns";
import { BOOKING_STATUS_COLORS } from "@/lib/constants";
import { Users } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

export default async function GuestsPage({
  params,
}: {
  params: Promise<{ hostelId: string }>;
}) {
  const { hostelId } = await params;
  await requireHostelAccess(hostelId);

  const bookings = await db.booking.findMany({
    where: {
      hostelId,
      status: { in: ["CHECKED_IN", "APPROVED"] },
    },
    include: {
      guest: true,
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
          <Users className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Guests</h1>
            <p className="text-muted-foreground">
              Current and approved guests at this hostel
            </p>
          </div>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <Users className="h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">No active guests</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            There are no checked-in or approved guests currently.
          </p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Guest</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Room / Bed</TableHead>
                <TableHead>Check-in Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={booking.guest.avatar || undefined}
                          alt={booking.guest.name}
                        />
                        <AvatarFallback>
                          {booking.guest.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">
                        {booking.guest.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{booking.guest.email}</TableCell>
                  <TableCell>
                    {booking.guest.phone || (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {booking.bed ? (
                      <div>
                        <p className="font-medium">
                          Room {booking.bed.room.roomNumber} - Bed{" "}
                          {booking.bed.bedNumber}
                        </p>
                        {booking.bed.room.floor && (
                          <p className="text-sm text-muted-foreground">
                            {booking.bed.room.floor.name}
                          </p>
                        )}
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
