import { z } from "zod";

export const createFloorSchema = z.object({
  name: z.string().min(1, "Floor name is required"),
  floorNumber: z.coerce.number().int().min(0, "Floor number must be 0 or greater"),
  description: z.string().optional(),
});

export const createRoomSchema = z.object({
  roomNumber: z.string().min(1, "Room number is required"),
  name: z.string().optional(),
  type: z.enum(["SINGLE", "DOUBLE", "TRIPLE", "QUAD", "DORMITORY"]),
  capacity: z.coerce.number().int().min(1).max(20),
  monthlyRent: z.coerce.number().min(0),
  deposit: z.coerce.number().min(0).default(0),
  floorId: z.string().min(1, "Floor is required"),
  amenities: z.array(z.string()).default([]),
  description: z.string().optional(),
});

export const createBedSchema = z.object({
  bedNumber: z.string().min(1, "Bed number is required"),
  roomId: z.string().min(1, "Room is required"),
  monthlyRent: z.coerce.number().min(0).optional(),
});

export const updateRoomSchema = createRoomSchema.partial();
export const updateFloorSchema = createFloorSchema.partial();

export type CreateFloorInput = z.infer<typeof createFloorSchema>;
export type CreateRoomInput = z.infer<typeof createRoomSchema>;
export type CreateBedInput = z.infer<typeof createBedSchema>;
