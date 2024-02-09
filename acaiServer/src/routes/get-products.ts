import { FastifyInstance } from 'fastify'
import { auth } from '../../lib/auth'
import { prisma } from '../../infra/prisma/database'
import { z } from 'zod'

export async function getProducts(server: FastifyInstance) {
  server.get('/products', { preHandler: [auth] }, async (req, res) => {
    try {
      const products = await prisma.products.findMany()
      return { products }
    } catch (error) {
      console.error(error)
      res.status(409)
    }
  })
  server.get('/products/:id', { preHandler: [auth] }, async (req, res) => {
    const productParamsSchema = z.object({
      id: z.string(),
    })
    const { id } = productParamsSchema.parse(req.params)
    const product = await prisma.products.findFirst({
      where: {
        id,
      },
    })
    return product
  })
}
