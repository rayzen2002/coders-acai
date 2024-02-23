import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { auth } from '../../lib/auth'
import { prisma } from '../../infra/prisma/database'

export async function createShipment(server: FastifyInstance) {
  server.post('/shipment', { preHandler: [auth] }, async (req, res) => {
    const shipmentSchema = z.object({
      temperature: z.number(),
      origin: z.string(),
      destiny: z.string(),
      fuelPriceInCents: z.number(),
      userId: z.string().optional(),
    })
    try {
      const { temperature, origin, destiny, fuelPriceInCents, userId } =
        shipmentSchema.parse(req.body)

      // TODO : apply similar logic to user
      // const distributor = await prisma.distributor.findFirst({
      //   where: {
      //     name: shipment.distributorName,
      //   },
      // });

      await prisma.shipment.create({
        data: {
          temperature,
          origin,
          destiny,
          fuelPriceInCents,
          userId,
        },
      })

      res.status(201).send()
    } catch (error) {
      console.error(error)
      res
        .status(500)
        .send({ error: 'An error occurred while creating the shipment.' })
    }
  })
}

export default createShipment
