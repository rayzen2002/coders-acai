import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { auth } from '../../lib/auth'
import { prisma } from '../../infra/prisma/database'

export async function deleteOrder(server: FastifyInstance) {
  server.delete('/orders/:id', { preHandler: [auth] }, async (req, res) => {
    const orderParamsSchema = z.object({
      id: z.string(),
    })
    const order = orderParamsSchema.parse(req.params)
    try {
      await prisma.orderItems.deleteMany({
        where: {
          orderId: order.id,
        },
      })
      await prisma.orders.delete({
        where: {
          id: order.id,
        },
      })
      res.status(204)
    } catch (error) {
      console.error(error)
      res.status(409)
    }
  })
}

export default deleteOrder
