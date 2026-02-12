import { db } from "@/lib/db";
import { withAuth, successResponse } from "@/lib/api-utils";

export async function GET() {
  return withAuth(async (session) => {
    const bookings = await db.booking.findMany({
      where: { guestId: session.id },
      include: {
        hostel: {
          select: { id: true, name: true, city: true },
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

    return successResponse(bookings);
  });
}
