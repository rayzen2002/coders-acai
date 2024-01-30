import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { auth } from '../../lib/auth'
import { prisma } from '../../infra/prisma/database'

export async function createOrder(server: FastifyInstance) {
  server.post('/order', { preHandler: [auth] }, async (req, res) => {
    const orderSchema = z.object({
      customerId: z.string(),
    })
    const order = orderSchema.parse(req.body)
    try {
      await prisma.orders.create({
        data: {
          customerId: order.customerId,
          total_in_cents: 0,
        },
      })
    } catch (error) {
      console.error(error)
      res.status(409)
    }
  })
}
