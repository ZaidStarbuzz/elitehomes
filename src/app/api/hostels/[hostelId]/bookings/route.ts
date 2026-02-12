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
    const status = searchParams.get("status");

    const where: Record<string, unknown> = { hostelId };
    if (status) where.status = status;

    const [bookings, total] = await Promise.all([
      db.booking.findMany({
        where,
        include: {
          guest: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              avatar: true,
            },
          },
          bed: {
            include: {
              room: { include: { floor: true } },
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      db.booking.count({ where }),
    ]);

    return successResponse({
      bookings,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  });
}
