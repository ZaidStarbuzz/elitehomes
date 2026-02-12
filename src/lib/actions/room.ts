"use server";

import { db } from "@/lib/db";
import { requireHostelAccess } from "@/lib/auth";
import {
  createFloorSchema,
  createRoomSchema,
  createBedSchema,
} from "@/lib/validations/room";
import { revalidatePath } from "next/cache";

// ── Floor Actions ──

export async function createFloor(hostelId: string, formData: FormData) {
  await requireHostelAccess(hostelId);

  const rawData = {
    name: formData.get("name") as string,
    floorNumber: formData.get("floorNumber") as string,
    description: (formData.get("description") as string) || undefined,
  };

  const parsed = createFloorSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const existing = await db.floor.findUnique({
    where: {
      hostelId_floorNumber: {
        hostelId,
        floorNumber: parsed.data.floorNumber,
      },
    },
  });

  if (existing) {
    return { error: "Floor number already exists" };
  }

  await db.floor.create({
    data: {
      ...parsed.data,
      hostelId,
    },
  });

  revalidatePath(`/admin/hostels/${hostelId}/floors`);
  return { success: true };
}

export async function deleteFloor(hostelId: string, floorId: string) {
  await requireHostelAccess(hostelId);

  const roomCount = await db.room.count({ where: { floorId } });
  if (roomCount > 0) {
    return { error: "Cannot delete floor with rooms. Remove rooms first." };
  }

  await db.floor.delete({ where: { id: floorId } });

  revalidatePath(`/admin/hostels/${hostelId}/floors`);
  return { success: true };
}

// ── Room Actions ──

export async function createRoom(hostelId: string, formData: FormData) {
  await requireHostelAccess(hostelId);

  const rawData = {
    roomNumber: formData.get("roomNumber") as string,
    name: (formData.get("name") as string) || undefined,
    type: formData.get("type") as string,
    capacity: formData.get("capacity") as string,
    monthlyRent: formData.get("monthlyRent") as string,
    deposit: (formData.get("deposit") as string) || "0",
    floorId: formData.get("floorId") as string,
    amenities: formData.getAll("amenities") as string[],
    description: (formData.get("description") as string) || undefined,
  };

  const parsed = createRoomSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const existing = await db.room.findUnique({
    where: {
      hostelId_roomNumber: {
        hostelId,
        roomNumber: parsed.data.roomNumber,
      },
    },
  });

  if (existing) {
    return { error: "Room number already exists in this hostel" };
  }

  const room = await db.room.create({
    data: {
      ...parsed.data,
      hostelId,
    },
  });

  // Auto-create beds based on capacity
  const bedPromises = Array.from({ length: parsed.data.capacity }, (_, i) =>
    db.bed.create({
      data: {
        bedNumber: `${parsed.data.roomNumber}-B${i + 1}`,
        roomId: room.id,
        hostelId,
        monthlyRent: parsed.data.monthlyRent,
      },
    })
  );

  await Promise.all(bedPromises);

  // Update hostel total capacity
  const totalBeds = await db.bed.count({
    where: { hostelId, isActive: true },
  });
  await db.hostel.update({
    where: { id: hostelId },
    data: { totalCapacity: totalBeds },
  });

  revalidatePath(`/admin/hostels/${hostelId}/rooms`);
  return { success: true };
}

export async function updateRoom(
  hostelId: string,
  roomId: string,
  formData: FormData
) {
  await requireHostelAccess(hostelId);

  const data: Record<string, unknown> = {};
  const name = formData.get("name") as string;
  const monthlyRent = formData.get("monthlyRent") as string;
  const deposit = formData.get("deposit") as string;
  const status = formData.get("status") as string;
  const description = formData.get("description") as string;

  if (name) data.name = name;
  if (monthlyRent) data.monthlyRent = parseFloat(monthlyRent);
  if (deposit) data.deposit = parseFloat(deposit);
  if (status) data.status = status;
  if (description) data.description = description;

  await db.room.update({
    where: { id: roomId },
    data,
  });

  revalidatePath(`/admin/hostels/${hostelId}/rooms`);
  return { success: true };
}

export async function deleteRoom(hostelId: string, roomId: string) {
  await requireHostelAccess(hostelId);

  const occupiedBeds = await db.bed.count({
    where: { roomId, status: "OCCUPIED" },
  });

  if (occupiedBeds > 0) {
    return { error: "Cannot delete room with occupied beds" };
  }

  await db.room.update({
    where: { id: roomId },
    data: { isActive: false },
  });

  await db.bed.updateMany({
    where: { roomId },
    data: { isActive: false },
  });

  // Update hostel total capacity
  const totalBeds = await db.bed.count({
    where: { hostelId, isActive: true },
  });
  await db.hostel.update({
    where: { id: hostelId },
    data: { totalCapacity: totalBeds },
  });

  revalidatePath(`/admin/hostels/${hostelId}/rooms`);
  return { success: true };
}

// ── Bed Actions ──

export async function createBed(hostelId: string, formData: FormData) {
  await requireHostelAccess(hostelId);

  const rawData = {
    bedNumber: formData.get("bedNumber") as string,
    roomId: formData.get("roomId") as string,
    monthlyRent: (formData.get("monthlyRent") as string) || undefined,
  };

  const parsed = createBedSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  await db.bed.create({
    data: {
      ...parsed.data,
      hostelId,
    },
  });

  // Update hostel total capacity
  const totalBeds = await db.bed.count({
    where: { hostelId, isActive: true },
  });
  await db.hostel.update({
    where: { id: hostelId },
    data: { totalCapacity: totalBeds },
  });

  revalidatePath(`/admin/hostels/${hostelId}/beds`);
  return { success: true };
}

export async function updateBedStatus(
  hostelId: string,
  bedId: string,
  status: string
) {
  await requireHostelAccess(hostelId);

  await db.bed.update({
    where: { id: bedId },
    data: { status: status as "AVAILABLE" | "OCCUPIED" | "RESERVED" | "MAINTENANCE" },
  });

  revalidatePath(`/admin/hostels/${hostelId}/beds`);
  return { success: true };
}
