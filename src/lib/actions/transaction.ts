"use server";

import { db } from "@/lib/db";
import { requireHostelAccess } from "@/lib/auth";
import { createTransactionSchema } from "@/lib/validations/transaction";
import { revalidatePath } from "next/cache";

export async function createTransaction(hostelId: string, formData: FormData) {
  await requireHostelAccess(hostelId);

  const rawData = {
    type: formData.get("type") as string,
    category: formData.get("category") as string,
    amount: formData.get("amount") as string,
    description: (formData.get("description") as string) || undefined,
    paymentMethod: (formData.get("paymentMethod") as string) || undefined,
    bookingId: (formData.get("bookingId") as string) || undefined,
    date: (formData.get("date") as string) || undefined,
  };

  const parsed = createTransactionSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  await db.transaction.create({
    data: {
      ...parsed.data,
      hostelId,
      paymentStatus: "COMPLETED",
    },
  });

  // If this is a booking payment, update totalPaid
  if (parsed.data.bookingId && parsed.data.type === "INCOME") {
    const booking = await db.booking.findUnique({
      where: { id: parsed.data.bookingId },
    });
    if (booking) {
      await db.booking.update({
        where: { id: parsed.data.bookingId },
        data: {
          totalPaid: {
            increment: parsed.data.amount,
          },
        },
      });
    }
  }

  revalidatePath(`/admin/hostels/${hostelId}/finance`);
  return { success: true };
}

export async function deleteTransaction(
  hostelId: string,
  transactionId: string
) {
  await requireHostelAccess(hostelId);

  await db.transaction.delete({
    where: { id: transactionId },
  });

  revalidatePath(`/admin/hostels/${hostelId}/finance`);
  return { success: true };
}
