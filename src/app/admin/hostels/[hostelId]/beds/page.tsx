import { requireHostelAccess } from "@/lib/auth";
import { db } from "@/lib/db";
import { BED_STATUS_COLORS } from "@/lib/constants";
import { BedDouble } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default async function BedsPage({
  params,
}: {
  params: Promise<{ hostelId: string }>;
}) {
  const { hostelId } = await params;
  await requireHostelAccess(hostelId);

  const beds = await db.bed.findMany({
    where: { hostelId, isActive: true },
    include: {
      room: {
        include: { floor: true },
      },
    },
    orderBy: { bedNumber: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BedDouble className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Beds</h1>
            <p className="text-muted-foreground">
              View and manage all beds in this hostel
            </p>
          </div>
        </div>
      </div>

      {beds.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <BedDouble className="h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">No beds yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Beds are automatically created when you add rooms. Go to the Rooms
            page to get started.
          </p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bed Number</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Floor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Monthly Rent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {beds.map((bed) => (
                <TableRow key={bed.id}>
                  <TableCell className="font-medium">
                    {bed.bedNumber}
                  </TableCell>
                  <TableCell>
                    {bed.room ? `Room ${bed.room.roomNumber}` : "-"}
                  </TableCell>
                  <TableCell>
                    {bed.room?.floor ? bed.room.floor.name : "-"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        BED_STATUS_COLORS[bed.status] ||
                        "bg-gray-100 text-gray-800"
                      }
                      variant="secondary"
                    >
                      {bed.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                    }).format(Number(bed.monthlyRent))}
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
