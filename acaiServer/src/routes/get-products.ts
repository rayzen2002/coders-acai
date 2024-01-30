import { FastifyInstance } from 'fastify'
import { auth } from '../../lib/auth'
import { prisma } from '../../infra/prisma/database'

export async function getProducts(server: FastifyInstance) {
  server.get('/products', { preHandler: [auth] }, async (req, res) => {
    // const productSchema = z.object({
    //   name: z.string(),
    //   description: z.string(),
    //   priceInCents: z.number(),
    // })
    // const product = productSchema.parse(req.body)
    try {
      const products = await prisma.products.findMany()
      return { products }
    } catch (error) {
      console.error(error)
      res.status(409)
    }
  })
}
