import { z } from "zod";

export const createHostelSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  country: z.string().default("India"),
  zipCode: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  amenities: z.array(z.string()).default([]),
  rules: z.array(z.string()).default([]),
});

export const updateHostelSchema = createHostelSchema.partial();

export type CreateHostelInput = z.infer<typeof createHostelSchema>;
export type UpdateHostelInput = z.infer<typeof updateHostelSchema>;
