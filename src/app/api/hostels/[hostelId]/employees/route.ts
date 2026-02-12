import { db } from "@/lib/db";
import { withHostelAccess, successResponse } from "@/lib/api-utils";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ hostelId: string }> }
) {
  const { hostelId } = await params;

  return withHostelAccess(hostelId, async () => {
    const employees = await db.employee.findMany({
      where: { hostelId, isActive: true },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return successResponse(employees);
  });
}
