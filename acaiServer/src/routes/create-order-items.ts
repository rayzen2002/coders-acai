import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { auth } from '../../lib/auth'
import { prisma } from '../../infra/prisma/database'

export async function createOrderItems(server: FastifyInstance) {
  server.post('/order-item', { preHandler: [auth] }, async (req, res) => {
    const orderItemsSchema = z.object({
      orderId: z.string(),
      productId: z.string(),
      quantity: z.number(),
    })
    const orderItems = orderItemsSchema.parse(req.body)
    try {
      await prisma.products.create({
        data: {
          name: orderItems.orderId,
          description: orderItems.productId,
          price_in_cents: orderItems.quantity,
        },
      })
    } catch (error) {
      console.error(error)
      res.status(409)
    }
  })
}
