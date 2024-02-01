import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { auth } from '../../lib/auth'
import { prisma } from '../../infra/prisma/database'

export async function deleteProduct(server: FastifyInstance) {
  server.delete('/product/:id', { preHandler: [auth] }, async (req, res) => {
    const productParamsSchema = z.object({
      id: z.string(),
    })
    console.log(req.params)
    const product = productParamsSchema.parse(req.params)
    try {
      await prisma.products.delete({
        where: {
          id: product.id,
        },
      })
    } catch (error) {
      console.error(error)
      res.status(409)
    }
    console.log('oiee')
  })
}