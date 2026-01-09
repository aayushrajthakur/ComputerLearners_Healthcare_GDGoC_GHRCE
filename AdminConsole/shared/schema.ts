import { z } from "zod";

export const userLocationSchema = z.object({
  username: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  timestamp: z.number().optional().default(() => Date.now()),
  isOnline: z.boolean().optional().default(false),
  accuracy: z.number().optional(),
});

export type UserLocation = z.infer<typeof userLocationSchema>;

export const userLocationUpdateSchema = userLocationSchema.pick({
  username: true,
  latitude: true,
  longitude: true,
  timestamp: true,
  accuracy: true,
});

export type UserLocationUpdate = z.infer<typeof userLocationUpdateSchema>;
