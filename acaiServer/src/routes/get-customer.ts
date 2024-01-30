import { FastifyInstance } from 'fastify'
import { auth } from '../../lib/auth'
import { prisma } from '../../infra/prisma/database'

export async function getCustomer(server: FastifyInstance) {
  server.get('/customer', { preHandler: [auth] }, async (req, res) => {
    // const productSchema = z.object({
    //   name: z.string(),
    //   description: z.string(),
    //   priceInCents: z.number(),
    // })
    // const product = productSchema.parse(req.body)
    try {
      const customer = await prisma.customers.findMany()
      return { customer }
    } catch (error) {
      console.error(error)
      res.status(409)
    }
  })
}
