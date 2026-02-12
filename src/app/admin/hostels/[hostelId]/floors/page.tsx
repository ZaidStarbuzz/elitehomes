import { requireHostelAccess } from "@/lib/auth";
import { db } from "@/lib/db";
import { Layers } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AddFloorButton,
  DeleteFloorButton,
} from "@/components/admin/floor-actions";

export default async function FloorsPage({
  params,
}: {
  params: Promise<{ hostelId: string }>;
}) {
  const { hostelId } = await params;
  await requireHostelAccess(hostelId);

  const floors = await db.floor.findMany({
    where: { hostelId, isActive: true },
    include: {
      _count: {
        select: { rooms: true },
      },
    },
    orderBy: { floorNumber: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Layers className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Floors</h1>
            <p className="text-muted-foreground">
              Manage floors for this hostel
            </p>
          </div>
        </div>
        <AddFloorButton hostelId={hostelId} />
      </div>

      {floors.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <Layers className="h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">No floors yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Get started by adding a floor to your hostel.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {floors.map((floor) => (
            <Card key={floor.id}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div>
                  <CardTitle className="text-lg">{floor.name}</CardTitle>
                  <CardDescription>Floor {floor.floorNumber}</CardDescription>
                </div>
                <DeleteFloorButton hostelId={hostelId} floorId={floor.id} />
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium">{floor._count.rooms}</span>
                    <span className="text-muted-foreground">
                      {floor._count.rooms === 1 ? "Room" : "Rooms"}
                    </span>
                  </div>
                </div>
                {floor.description && (
                  <p className="mt-3 text-sm text-muted-foreground">
                    {floor.description}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
