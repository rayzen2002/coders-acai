import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { auth } from '../../lib/auth'
import { prisma } from '../../infra/prisma/database'

export async function deleteShipment(server: FastifyInstance) {
  server.delete('/shipments/:id', { preHandler: [auth] }, async (req, res) => {
    const shipmentParamsSchema = z.object({
      id: z.string(),
    })
    console.log(req.params)
    const shipment = shipmentParamsSchema.parse(req.params)
    try {
      await prisma.shipment.delete({
        where: {
          id: shipment.id,
        },
      })
    } catch (error) {
      console.error(error)
      res.status(409)
    }
  })
}

export default deleteShipment
