import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { auth } from '../../lib/auth'
import { prisma } from '../../infra/prisma/database'

export async function deleteCustomer(server: FastifyInstance) {
  server.delete('/customer/:id', { preHandler: [auth] }, async (req, res) => {
    const customerParamsSchema = z.object({
      id: z.string(),
    })
    console.log(req.params)
    const customer = customerParamsSchema.parse(req.params)
    try {
      await prisma.customers.delete({
        where: {
          id: customer.id,
        },
      })
    } catch (error) {
      console.error(error)
      res.status(409)
    }
    console.log('oiee')
  })
}
