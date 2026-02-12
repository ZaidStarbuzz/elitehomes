import { db } from "@/lib/db";
import { withHostelAccess, successResponse, errorResponse } from "@/lib/api-utils";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ hostelId: string }> }
) {
  const { hostelId } = await params;

  return withHostelAccess(hostelId, async () => {
    const hostel = await db.hostel.findUnique({
      where: { id: hostelId },
      include: {
        admin: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        floors: { orderBy: { floorNumber: "asc" } },
        _count: {
          select: {
            rooms: true,
            beds: true,
            bookings: true,
            employees: true,
            complaints: true,
          },
        },
      },
    });

    if (!hostel) {
      return errorResponse("Hostel not found", 404);
    }

    return successResponse(hostel);
  });
}
