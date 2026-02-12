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
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Building2, BedDouble, MapPin, IndianRupee } from "lucide-react";
import { ROOM_TYPE_LABELS } from "@/lib/constants";
import { BookingForm } from "@/components/forms/booking-form";

export default async function GuestRoomsPage() {
  const session = await requireAuth();

  const hostels = await db.hostel.findMany({
    where: { isActive: true },
    include: {
      rooms: {
        where: {
          isActive: true,
          status: "AVAILABLE",
        },
        include: {
          floor: true,
          beds: {
            where: {
              isActive: true,
              status: "AVAILABLE",
            },
          },
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Available Rooms
        </h1>
        <p className="text-muted-foreground">
          Browse hostels and find your ideal room.
        </p>
      </div>

      {hostels.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Building2 className="mx-auto size-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No Hostels Available</h3>
            <p className="text-sm text-muted-foreground mt-1">
              There are currently no hostels with available rooms. Please check
              back later.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {hostels.map((hostel) => {
            const roomsWithBeds = hostel.rooms.filter(
              (room) => room.beds.length > 0
            );

            if (roomsWithBeds.length === 0) return null;

            // Flatten all available beds for this hostel for the booking form
            const allAvailableBeds = roomsWithBeds.flatMap((room) =>
              room.beds.map((bed) => ({
                id: bed.id,
                bedNumber: bed.bedNumber,
                monthlyRent: bed.monthlyRent
                  ? Number(bed.monthlyRent)
                  : Number(room.monthlyRent),
                room: { roomNumber: room.roomNumber },
              }))
            );

            return (
              <div key={hostel.id} className="space-y-4">
                <div className="flex items-center gap-3">
                  <Building2 className="size-6 text-primary" />
                  <div>
                    <h2 className="text-xl font-semibold">{hostel.name}</h2>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="size-3" />
                      {hostel.city}
                      {hostel.state ? `, ${hostel.state}` : ""}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {roomsWithBeds.map((room) => (
                    <Card key={room.id}>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>Room {room.roomNumber}</span>
                          <Badge variant="secondary">
                            {ROOM_TYPE_LABELS[room.type] || room.type}
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          Floor {room.floor.floorNumber}
                          {room.floor.name ? ` - ${room.floor.name}` : ""}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-1.5 text-muted-foreground">
                            <BedDouble className="size-4" />
                            Available Beds
                          </span>
                          <span className="font-medium">
                            {room.beds.length}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-1.5 text-muted-foreground">
                            <IndianRupee className="size-4" />
                            Monthly Rent
                          </span>
                          <span className="font-semibold">
                            {new Intl.NumberFormat("en-IN", {
                              style: "currency",
                              currency: "INR",
                            }).format(Number(room.monthlyRent))}
                          </span>
                        </div>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="w-full" size="sm">
                              Book Now
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>
                                Book Room {room.roomNumber} at {hostel.name}
                              </DialogTitle>
                            </DialogHeader>
                            <BookingForm
                              hostelId={hostel.id}
                              beds={room.beds.map((bed) => ({
                                id: bed.id,
                                bedNumber: bed.bedNumber,
                                monthlyRent: bed.monthlyRent
                                  ? Number(bed.monthlyRent)
                                  : Number(room.monthlyRent),
                                room: { roomNumber: room.roomNumber },
                              }))}
                            />
                          </DialogContent>
                        </Dialog>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
