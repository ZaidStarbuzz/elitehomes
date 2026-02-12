import { db } from "@/lib/db";
import { withAuth, successResponse } from "@/lib/api-utils";

export async function GET() {
  return withAuth(async (session) => {
    const complaints = await db.complaint.findMany({
      where: { authorId: session.id },
      include: {
        hostel: {
          select: { id: true, name: true },
        },
        assignee: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return successResponse(complaints);
  });
}
