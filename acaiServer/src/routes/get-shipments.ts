import { FastifyInstance } from 'fastify'
import { auth } from '../../lib/auth'
import { prisma } from '../../infra/prisma/database'

export async function getShipment(server: FastifyInstance) {
  server.get('/shipments', { preHandler: [auth] }, async (req, res) => {
    try {
      const shipments = await prisma.shipment.findMany()
      return { shipments }
    } catch (error) {
      console.error(error)
      res.status(409)
    }
  })
}
