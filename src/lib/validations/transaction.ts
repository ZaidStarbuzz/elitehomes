import { z } from "zod";

export const createTransactionSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"]),
  category: z.enum([
    "ROOM_FEE",
    "DEPOSIT",
    "SALARY",
    "UTILITIES",
    "MAINTENANCE_COST",
    "SUPPLIES",
    "FOOD",
    "MISCELLANEOUS",
    "REFUND",
  ]),
  amount: z.coerce.number().positive("Amount must be positive"),
  description: z.string().optional(),
  paymentMethod: z.string().optional(),
  bookingId: z.string().optional(),
  date: z.coerce.date().default(() => new Date()),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
