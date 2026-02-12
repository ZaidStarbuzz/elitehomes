import { z } from "zod";

export const createEmployeeSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  employeeRole: z.enum([
    "WARDEN",
    "CLEANING_STAFF",
    "COOK",
    "MAINTENANCE_STAFF",
    "SECURITY",
    "RECEPTIONIST",
    "MANAGER",
    "OTHER",
  ]),
  salary: z.coerce.number().min(0),
  department: z.string().optional(),
});

export const updateEmployeeSchema = createEmployeeSchema.partial();

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;
