import { z } from "zod";

export const createComplaintSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.enum([
    "MAINTENANCE",
    "CLEANLINESS",
    "NOISE",
    "SECURITY",
    "FOOD",
    "PLUMBING",
    "ELECTRICAL",
    "OTHER",
  ]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
  hostelId: z.string().min(1, "Hostel is required"),
});

export const updateComplaintSchema = z.object({
  status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  assigneeId: z.string().optional(),
  resolution: z.string().optional(),
});

export type CreateComplaintInput = z.infer<typeof createComplaintSchema>;
export type UpdateComplaintInput = z.infer<typeof updateComplaintSchema>;
