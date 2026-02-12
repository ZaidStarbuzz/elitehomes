import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import {
  withHostelAccess,
  successResponse,
  parsePagination,
} from "@/lib/api-utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ hostelId: string }> }
) {
  const { hostelId } = await params;

  return withHostelAccess(hostelId, async () => {
    const { searchParams } = request.nextUrl;
    const { page, limit, skip } = parsePagination(searchParams);
    const floorId = searchParams.get("floorId");
    const status = searchParams.get("status");
    const type = searchParams.get("type");

    const where: Record<string, unknown> = {
      hostelId,
      isActive: true,
    };
    if (floorId) where.floorId = floorId;
    if (status) where.status = status;
    if (type) where.type = type;

    const [rooms, total] = await Promise.all([
      db.room.findMany({
        where,
        include: {
          floor: true,
          beds: { where: { isActive: true } },
          _count: { select: { beds: true } },
        },
        skip,
        take: limit,
        orderBy: { roomNumber: "asc" },
      }),
      db.room.count({ where }),
    ]);

    return successResponse({
      rooms,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  });
}
