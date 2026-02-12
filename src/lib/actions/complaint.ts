"use server";

import { db } from "@/lib/db";
import { requireAuth, requireHostelAccess, generateTicketNumber } from "@/lib/auth";
import {
  createComplaintSchema,
  updateComplaintSchema,
} from "@/lib/validations/complaint";
import { revalidatePath } from "next/cache";

export async function createComplaint(formData: FormData) {
  const session = await requireAuth();

  const rawData = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    category: formData.get("category") as string,
    priority: (formData.get("priority") as string) || "MEDIUM",
    hostelId: formData.get("hostelId") as string,
  };

  const parsed = createComplaintSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  await db.complaint.create({
    data: {
      ticketNumber: generateTicketNumber(),
      title: parsed.data.title,
      description: parsed.data.description,
      category: parsed.data.category,
      priority: parsed.data.priority,
      hostelId: parsed.data.hostelId,
      authorId: session.id,
    },
  });

  revalidatePath("/guest/complaints");
  return { success: true };
}

export async function updateComplaint(
  hostelId: string,
  complaintId: string,
  formData: FormData
) {
  await requireHostelAccess(hostelId);

  const rawData = {
    status: (formData.get("status") as string) || undefined,
    priority: (formData.get("priority") as string) || undefined,
    assigneeId: (formData.get("assigneeId") as string) || undefined,
    resolution: (formData.get("resolution") as string) || undefined,
  };

  const parsed = updateComplaintSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const data: Record<string, unknown> = { ...parsed.data };

  if (parsed.data.status === "RESOLVED" || parsed.data.status === "CLOSED") {
    data.resolvedAt = new Date();
  }

  await db.complaint.update({
    where: { id: complaintId },
    data,
  });

  revalidatePath(`/admin/hostels/${hostelId}/complaints`);
  return { success: true };
}

export async function assignComplaint(
  hostelId: string,
  complaintId: string,
  assigneeId: string
) {
  await requireHostelAccess(hostelId);

  await db.complaint.update({
    where: { id: complaintId },
    data: {
      assigneeId,
      status: "IN_PROGRESS",
    },
  });

  revalidatePath(`/admin/hostels/${hostelId}/complaints`);
  return { success: true };
}
