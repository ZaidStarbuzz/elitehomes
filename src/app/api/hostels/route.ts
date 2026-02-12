import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import {
  withAuth,
  successResponse,
  errorResponse,
  parsePagination,
} from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  return withAuth(async (session) => {
    const { searchParams } = request.nextUrl;
    const { page, limit, skip } = parsePagination(searchParams);

    const where =
      session.role === "SUPER_ADMIN"
        ? { isActive: true }
        : {
            isActive: true,
            OR: [
              { adminId: session.id },
              {
                members: {
                  some: { userId: session.id, isActive: true },
                },
              },
            ],
          };

    const [hostels, total] = await Promise.all([
      db.hostel.findMany({
        where,
        include: {
          admin: {
            select: { id: true, name: true, email: true },
          },
          _count: {
            select: {
              rooms: true,
              beds: true,
              bookings: true,
              employees: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      db.hostel.count({ where }),
    ]);

    return successResponse({
      hostels,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  });
}
