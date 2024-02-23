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
      const orderItem = await prisma.orderItems.create({
        data: {
          orderId: orderItems.orderId,
          productId: orderItems.productId,
          quantity: orderItems.quantity,
        },
      })
      // console.log(orderItem)
      res.status(200).send(orderItem)
    } catch (error) {
      console.error(error)
      res.status(409)
    }
  })
}

export default createOrderItems
