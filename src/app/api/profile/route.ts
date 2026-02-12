import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { withAuth, successResponse, errorResponse } from "@/lib/api-utils";

export async function GET() {
  return withAuth(async (session) => {
    const user = await db.user.findUnique({
      where: { id: session.id },
      include: {
        hostelMembers: {
          include: {
            hostel: {
              select: { id: true, name: true, city: true },
            },
          },
          where: { isActive: true },
        },
      },
    });

    return successResponse(user);
  });
}

export async function PATCH(request: NextRequest) {
  return withAuth(async (session) => {
    try {
      const body = await request.json();

      const allowedFields = [
        "name",
        "phone",
        "gender",
        "dateOfBirth",
        "address",
        "city",
        "state",
        "country",
        "zipCode",
        "idType",
        "idNumber",
      ];

      const data: Record<string, unknown> = {};
      for (const field of allowedFields) {
        if (body[field] !== undefined) {
          data[field] = body[field];
        }
      }

      const user = await db.user.update({
        where: { id: session.id },
        data,
      });

      return successResponse(user);
    } catch {
      return errorResponse("Failed to update profile");
    }
  });
}
