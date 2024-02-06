import { FastifyInstance } from 'fastify'
import { auth } from '../../lib/auth'
import { prisma } from '../../infra/prisma/database'

export async function getDistributor(server: FastifyInstance) {
  server.get('/distributors', { preHandler: [auth] }, async (req, res) => {
    try {
      const distributors = await prisma.distributor.findMany()
      return { distributors }
    } catch (error) {
      console.error(error)
      res.status(409)
    }
  })
}
