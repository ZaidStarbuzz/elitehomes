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
    const type = searchParams.get("type");
    const category = searchParams.get("category");

    const where: Record<string, unknown> = { hostelId };
    if (type) where.type = type;
    if (category) where.category = category;

    const [transactions, total] = await Promise.all([
      db.transaction.findMany({
        where,
        include: {
          booking: {
            select: { bookingNumber: true, guest: { select: { name: true } } },
          },
        },
        skip,
        take: limit,
        orderBy: { date: "desc" },
      }),
      db.transaction.count({ where }),
    ]);

    return successResponse({
      transactions,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  });
}
