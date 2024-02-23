import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { auth } from '../../lib/auth'
import { prisma } from '../../infra/prisma/database'

export async function createDistributor(server: FastifyInstance) {
  server.post('/distributors', { preHandler: [auth] }, async (req, res) => {
    const distributorSchema = z.object({
      name: z.string(),
    })
    const { name } = distributorSchema.parse(req.body)
    try {
      await prisma.distributor.create({
        data: {
          name,
        },
      })
    } catch (error) {
      console.error(error)
      res.status(409)
    }
  })
}

export default createDistributor
