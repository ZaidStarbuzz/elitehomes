"use server";

import { db } from "@/lib/db";
import { requireAuth, requireHostelAccess, generateSlug } from "@/lib/auth";
import { createHostelSchema, updateHostelSchema } from "@/lib/validations/hostel";
import { revalidatePath } from "next/cache";

export async function createHostel(formData: FormData) {
  const session = await requireAuth();

  const rawData = {
    name: formData.get("name") as string,
    description: (formData.get("description") as string) || undefined,
    address: formData.get("address") as string,
    city: formData.get("city") as string,
    state: formData.get("state") as string,
    country: (formData.get("country") as string) || "India",
    zipCode: (formData.get("zipCode") as string) || undefined,
    phone: (formData.get("phone") as string) || undefined,
    email: (formData.get("email") as string) || undefined,
    gender: (formData.get("gender") as string) || undefined,
    amenities: formData.getAll("amenities") as string[],
    rules: formData.getAll("rules") as string[],
  };

  const parsed = createHostelSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const slug = generateSlug(parsed.data.name);

  // Check slug uniqueness
  const existing = await db.hostel.findUnique({ where: { slug } });
  if (existing) {
    return { error: "A hostel with this name already exists" };
  }

  const hostel = await db.hostel.create({
    data: {
      ...parsed.data,
      slug,
      adminId: session.id,
    },
  });

  // Update user role to HOSTEL_ADMIN if currently GUEST
  if (session.role === "GUEST") {
    await db.user.update({
      where: { id: session.id },
      data: { role: "HOSTEL_ADMIN" },
    });
  }

  // Add admin as hostel member
  await db.hostelMember.create({
    data: {
      hostelId: hostel.id,
      userId: session.id,
      role: "HOSTEL_ADMIN",
    },
  });

  revalidatePath("/admin/hostels");
  return { success: true, hostelId: hostel.id };
}

export async function updateHostel(hostelId: string, formData: FormData) {
  await requireHostelAccess(hostelId);

  const rawData = {
    name: (formData.get("name") as string) || undefined,
    description: (formData.get("description") as string) || undefined,
    address: (formData.get("address") as string) || undefined,
    city: (formData.get("city") as string) || undefined,
    state: (formData.get("state") as string) || undefined,
    phone: (formData.get("phone") as string) || undefined,
    email: (formData.get("email") as string) || undefined,
    amenities: formData.getAll("amenities") as string[],
    rules: formData.getAll("rules") as string[],
  };

  const parsed = updateHostelSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  await db.hostel.update({
    where: { id: hostelId },
    data: parsed.data,
  });

  revalidatePath(`/admin/hostels/${hostelId}`);
  return { success: true };
}

export async function deleteHostel(hostelId: string) {
  await requireHostelAccess(hostelId);

  await db.hostel.update({
    where: { id: hostelId },
    data: { isActive: false },
  });

  revalidatePath("/admin/hostels");
  return { success: true };
}
