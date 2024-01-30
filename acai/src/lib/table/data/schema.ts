import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const productSchema = z.object({
  id: z.string(),
  description: z.string(),
  status: z.string(),
  label: z.string(),
  weight: z.string(),
})

export type Product = z.infer<typeof productSchema>
