import { z } from 'zod';

export const dealBaseSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(5).optional(),
  image: z.string().url().optional(),
  offerPrice: z.number().positive(),
  originalPrice: z.number().positive(),
  category: z.string().min(2),
  source: z.string().min(2),
  affiliateLink: z.string().url().optional(),
  tags: z.array(z.string()).default([]),
  expiry: z.string().or(z.date()).optional(),
});

export const addDealSchema = dealBaseSchema;

export const updateDealSchema = dealBaseSchema.partial().extend({
  id: z.string().cuid(),
});

export type AddDealInput = z.infer<typeof addDealSchema>;
export type UpdateDealInput = z.infer<typeof updateDealSchema>;
