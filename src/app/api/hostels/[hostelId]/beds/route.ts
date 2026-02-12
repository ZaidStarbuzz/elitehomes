import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { withHostelAccess, successResponse, parsePagination } from "@/lib/api-utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ hostelId: string }> }
) {
  const { hostelId } = await params;

  return withHostelAccess(hostelId, async () => {
    const { searchParams } = request.nextUrl;
    const { page, limit, skip } = parsePagination(searchParams);
    const roomId = searchParams.get("roomId");
    const status = searchParams.get("status");

    const where: Record<string, unknown> = {
      hostelId,
      isActive: true,
    };
    if (roomId) where.roomId = roomId;
    if (status) where.status = status;

    const [beds, total] = await Promise.all([
      db.bed.findMany({
        where,
        include: {
          room: {
            include: { floor: true },
          },
        },
        skip,
        take: limit,
        orderBy: { bedNumber: "asc" },
      }),
      db.bed.count({ where }),
    ]);

    return successResponse({
      beds,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  });
}
