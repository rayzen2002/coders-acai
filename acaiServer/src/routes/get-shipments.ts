import { FastifyInstance } from 'fastify'
import { auth } from '../../lib/auth'
import { prisma } from '../../infra/prisma/database'

export async function getShipment(server: FastifyInstance) {
  server.get('/shipments', { preHandler: [auth] }, async (req, res) => {
    // const productSchema = z.object({
    //   name: z.string(),
    //   description: z.string(),
    //   priceInCents: z.number(),
    // })
    // const product = productSchema.parse(req.body)
    try {
      const shipments = await prisma.shipment.findMany()
      return { shipments }
    } catch (error) {
      console.error(error)
      res.status(409)
    }
  })
}
