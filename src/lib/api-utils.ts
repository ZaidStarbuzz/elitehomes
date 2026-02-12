import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import type { UserRole } from "@prisma/client";
import type { SessionUser } from "@/types";

export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function errorResponse(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export function validationErrorResponse(error: ZodError) {
  const messages = error.issues.map((e) => e.message).join(", ");
  return errorResponse(messages, 422);
}

export async function withAuth(
  handler: (session: SessionUser) => Promise<NextResponse>
): Promise<NextResponse> {
  const session = await getSession();
  if (!session) {
    return errorResponse("Unauthorized", 401);
  }
  return handler(session);
}

export async function withRole(
  roles: UserRole[],
  handler: (session: SessionUser) => Promise<NextResponse>
): Promise<NextResponse> {
  return withAuth(async (session) => {
    if (!roles.includes(session.role)) {
      return errorResponse("Forbidden", 403);
    }
    return handler(session);
  });
}

export async function withHostelAccess(
  hostelId: string,
  handler: (session: SessionUser) => Promise<NextResponse>
): Promise<NextResponse> {
  return withAuth(async (session) => {
    if (session.role === "SUPER_ADMIN") {
      return handler(session);
    }

    const hostel = await db.hostel.findFirst({
      where: {
        id: hostelId,
        OR: [
          { adminId: session.id },
          {
            members: {
              some: { userId: session.id, isActive: true },
            },
          },
        ],
      },
    });

    if (!hostel) {
      return errorResponse("Forbidden - No access to this hostel", 403);
    }

    return handler(session);
  });
}

export function parsePagination(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get("limit") || "10"))
  );
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}
