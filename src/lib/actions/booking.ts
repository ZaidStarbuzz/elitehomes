"use server";

import { db } from "@/lib/db";
import {
  requireAuth,
  requireHostelAccess,
  generateBookingNumber,
} from "@/lib/auth";
import { createBookingSchema } from "@/lib/validations/booking";
import { revalidatePath } from "next/cache";

export async function createBooking(formData: FormData) {
  const session = await requireAuth();

  const rawData = {
    hostelId: formData.get("hostelId") as string,
    bedId: (formData.get("bedId") as string) || undefined,
    checkInDate: formData.get("checkInDate") as string,
    checkOutDate: (formData.get("checkOutDate") as string) || undefined,
    notes: (formData.get("notes") as string) || undefined,
  };

  const parsed = createBookingSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  // Get monthly rent from bed or hostel default
  let monthlyRent = 0;
  if (parsed.data.bedId) {
    const bed = await db.bed.findUnique({
      where: { id: parsed.data.bedId },
      include: { room: true },
    });
    if (!bed || bed.status !== "AVAILABLE") {
      return { error: "Selected bed is not available" };
    }
    monthlyRent = Number(bed.monthlyRent || bed.room.monthlyRent);
  }

  const booking = await db.booking.create({
    data: {
      bookingNumber: generateBookingNumber(),
      hostelId: parsed.data.hostelId,
      guestId: session.id,
      bedId: parsed.data.bedId,
      checkInDate: parsed.data.checkInDate,
      checkOutDate: parsed.data.checkOutDate,
      monthlyRent,
      notes: parsed.data.notes,
    },
  });

  // Mark bed as reserved
  if (parsed.data.bedId) {
    await db.bed.update({
      where: { id: parsed.data.bedId },
      data: { status: "RESERVED" },
    });
  }

  revalidatePath("/guest/bookings");
  return { success: true, bookingId: booking.id };
}

export async function approveBooking(
  hostelId: string,
  bookingId: string,
  bedId?: string
) {
  await requireHostelAccess(hostelId);

  const booking = await db.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking || booking.status !== "PENDING") {
    return { error: "Invalid booking or status" };
  }

  const updateData: Record<string, unknown> = {
    status: "APPROVED",
  };

  if (bedId) {
    const bed = await db.bed.findUnique({ where: { id: bedId } });
    if (!bed || bed.status !== "AVAILABLE") {
      return { error: "Selected bed is not available" };
    }
    updateData.bedId = bedId;

    await db.bed.update({
      where: { id: bedId },
      data: { status: "RESERVED" },
    });

    // Set monthly rent from bed/room
    const bedWithRoom = await db.bed.findUnique({
      where: { id: bedId },
      include: { room: true },
    });
    if (bedWithRoom) {
      updateData.monthlyRent = Number(
        bedWithRoom.monthlyRent || bedWithRoom.room.monthlyRent
      );
    }
  }

  await db.booking.update({
    where: { id: bookingId },
    data: updateData,
  });

  // Add guest as hostel member
  await db.hostelMember.upsert({
    where: {
      hostelId_userId: {
        hostelId,
        userId: booking.guestId,
      },
    },
    create: {
      hostelId,
      userId: booking.guestId,
      role: "GUEST",
    },
    update: {
      isActive: true,
    },
  });

  revalidatePath(`/admin/hostels/${hostelId}/bookings`);
  return { success: true };
}

export async function rejectBooking(hostelId: string, bookingId: string) {
  await requireHostelAccess(hostelId);

  const booking = await db.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking) return { error: "Booking not found" };

  // Free the bed if reserved
  if (booking.bedId) {
    await db.bed.update({
      where: { id: booking.bedId },
      data: { status: "AVAILABLE" },
    });
  }

  await db.booking.update({
    where: { id: bookingId },
    data: { status: "REJECTED" },
  });

  revalidatePath(`/admin/hostels/${hostelId}/bookings`);
  return { success: true };
}

export async function checkIn(hostelId: string, bookingId: string) {
  await requireHostelAccess(hostelId);

  const booking = await db.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking || booking.status !== "APPROVED") {
    return { error: "Booking must be approved before check-in" };
  }

  if (!booking.bedId) {
    return { error: "A bed must be assigned before check-in" };
  }

  await db.booking.update({
    where: { id: bookingId },
    data: {
      status: "CHECKED_IN",
      actualCheckIn: new Date(),
    },
  });

  await db.bed.update({
    where: { id: booking.bedId },
    data: { status: "OCCUPIED" },
  });

  revalidatePath(`/admin/hostels/${hostelId}/bookings`);
  return { success: true };
}

export async function checkOut(hostelId: string, bookingId: string) {
  await requireHostelAccess(hostelId);

  const booking = await db.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking || booking.status !== "CHECKED_IN") {
    return { error: "Guest must be checked in before check-out" };
  }

  await db.booking.update({
    where: { id: bookingId },
    data: {
      status: "CHECKED_OUT",
      actualCheckOut: new Date(),
    },
  });

  if (booking.bedId) {
    await db.bed.update({
      where: { id: booking.bedId },
      data: { status: "AVAILABLE" },
    });
  }

  revalidatePath(`/admin/hostels/${hostelId}/bookings`);
  return { success: true };
}
