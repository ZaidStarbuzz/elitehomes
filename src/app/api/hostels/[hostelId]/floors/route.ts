import { db } from "@/lib/db";
import { withHostelAccess, successResponse } from "@/lib/api-utils";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ hostelId: string }> }
) {
  const { hostelId } = await params;

  return withHostelAccess(hostelId, async () => {
    const floors = await db.floor.findMany({
      where: { hostelId, isActive: true },
      include: {
        _count: { select: { rooms: true } },
      },
      orderBy: { floorNumber: "asc" },
    });

    return successResponse(floors);
  });
}
