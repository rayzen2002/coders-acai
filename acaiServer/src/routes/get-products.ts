import { FastifyInstance } from 'fastify'
import { auth } from '../../lib/auth'
import { prisma } from '../../infra/prisma/database'

export async function getProducts(server: FastifyInstance) {
  server.get('/products', { preHandler: [auth] }, async (req, res) => {
    try {
      const products = await prisma.products.findMany()
      return { products }
    } catch (error) {
      console.error(error)
      res.status(409)
    }
  })
}
