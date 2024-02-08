import { FastifyInstance } from 'fastify'
import { auth } from '../../lib/auth'
import { prisma } from '../../infra/prisma/database'

export async function getOrders(server: FastifyInstance) {
  server.get('/orders', { preHandler: [auth] }, async (req, res) => {
    try {
      const orders = await prisma.orders.findMany({
        include: {
          OrderItems: true,
        },
      })
      return { orders }
    } catch (error) {
      console.error(error)
      res.status(409)
    }
  })
}
