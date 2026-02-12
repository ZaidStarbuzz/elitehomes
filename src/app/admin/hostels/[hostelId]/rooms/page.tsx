import { requireHostelAccess } from "@/lib/auth";
import { db } from "@/lib/db";
import { ROOM_TYPE_LABELS } from "@/lib/constants";
import { DoorOpen } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AddRoomButton } from "@/components/admin/room-actions";

const ROOM_STATUS_COLORS: Record<string, string> = {
  AVAILABLE: "bg-green-100 text-green-800",
  OCCUPIED: "bg-red-100 text-red-800",
  MAINTENANCE: "bg-gray-100 text-gray-800",
  RESERVED: "bg-yellow-100 text-yellow-800",
};

export default async function RoomsPage({
  params,
}: {
  params: Promise<{ hostelId: string }>;
}) {
  const { hostelId } = await params;
  await requireHostelAccess(hostelId);

  const [rooms, floors] = await Promise.all([
    db.room.findMany({
      where: { hostelId, isActive: true },
      include: {
        floor: true,
        beds: { where: { isActive: true } },
        _count: { select: { beds: true } },
      },
      orderBy: { roomNumber: "asc" },
    }),
    db.floor.findMany({
      where: { hostelId, isActive: true },
      select: { id: true, name: true, floorNumber: true },
      orderBy: { floorNumber: "asc" },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <DoorOpen className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Rooms</h1>
            <p className="text-muted-foreground">
              Manage rooms for this hostel
            </p>
          </div>
        </div>
        <AddRoomButton hostelId={hostelId} floors={floors} />
      </div>

      {rooms.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <DoorOpen className="h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">No rooms yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Add floors first, then create rooms for your hostel.
          </p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Room #</TableHead>
                <TableHead>Floor</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Beds (Occupied / Total)</TableHead>
                <TableHead className="text-right">Monthly Rent</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rooms.map((room) => {
                const occupiedBeds = room.beds.filter(
                  (bed) => bed.status === "OCCUPIED"
                ).length;
                const totalBeds = room._count.beds;

                return (
                  <TableRow key={room.id}>
                    <TableCell className="font-medium">
                      {room.roomNumber}
                    </TableCell>
                    <TableCell>
                      {room.floor ? room.floor.name : "-"}
                    </TableCell>
                    <TableCell>
                      {ROOM_TYPE_LABELS[room.type] || room.type}
                    </TableCell>
                    <TableCell>{room.capacity}</TableCell>
                    <TableCell>
                      <span
                        className={
                          occupiedBeds === totalBeds && totalBeds > 0
                            ? "text-red-600 font-medium"
                            : "text-green-600 font-medium"
                        }
                      >
                        {occupiedBeds}
                      </span>
                      <span className="text-muted-foreground">
                        {" "}
                        / {totalBeds}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                      }).format(Number(room.monthlyRent))}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          ROOM_STATUS_COLORS[room.status] ||
                          "bg-gray-100 text-gray-800"
                        }
                        variant="secondary"
                      >
                        {room.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
