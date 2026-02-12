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
    const category = searchParams.get("category");

    const where: Record<string, unknown> = { hostelId };
    if (status) where.status = status;
    if (category) where.category = category;

    const [complaints, total] = await Promise.all([
      db.complaint.findMany({
        where,
        include: {
          author: {
            select: { id: true, name: true, email: true, avatar: true },
          },
          assignee: {
            select: { id: true, name: true, email: true },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      db.complaint.count({ where }),
    ]);

    return successResponse({
      complaints,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  });
}
