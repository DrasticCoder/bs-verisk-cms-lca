import { z } from 'zod';

export const productInsertSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  img_url: z.string().optional(),
});

export const productSelectSchema = z.object({
  id: z.string(),
  name: z.string(),
  img_url: z.string().nullable().optional(),
});

export type Product = z.infer<typeof productSelectSchema>;
export type ProductInsert = z.infer<typeof productInsertSchema>;
