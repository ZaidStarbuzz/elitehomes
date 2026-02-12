import { z } from "zod";

export const createBookingSchema = z.object({
  hostelId: z.string().min(1, "Hostel is required"),
  bedId: z.string().optional(),
  checkInDate: z.coerce.date(),
  checkOutDate: z.coerce.date().optional(),
  notes: z.string().optional(),
});

export const updateBookingSchema = z.object({
  status: z
    .enum([
      "PENDING",
      "APPROVED",
      "REJECTED",
      "CHECKED_IN",
      "CHECKED_OUT",
      "CANCELLED",
    ])
    .optional(),
  bedId: z.string().optional(),
  notes: z.string().optional(),
  checkInDate: z.coerce.date().optional(),
  checkOutDate: z.coerce.date().optional(),
});

export const assignBedSchema = z.object({
  bedId: z.string().min(1, "Bed is required"),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingInput = z.infer<typeof updateBookingSchema>;
