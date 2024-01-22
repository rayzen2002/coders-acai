import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { auth } from '../../lib/auth'
import { prisma } from '../../infra/prisma/database'

export async function createProduct(server: FastifyInstance) {
  server.post('/products', { preHandler: [auth] }, async (req, res) => {
    const productSchema = z.object({
      name: z.string(),
      description: z.string(),
      priceInCents: z.number(),
    })
    const product = productSchema.parse(req.body)
    try {
      await prisma.products.create({
        data: {
          name: product.name,
          description: product.description,
          price_in_cents: product.priceInCents,
        },
      })
    } catch (error) {
      console.error(error)
      res.status(409)
    }
  })
}
