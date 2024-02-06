import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { auth } from '../../lib/auth'
import { prisma } from '../../infra/prisma/database'

export async function createCustomer(server: FastifyInstance) {
  server.post('/customer', { preHandler: [auth] }, async (req, res) => {
    const customerSchema = z.object({
      name: z.string(),
      email: z.string(),
      address: z.string(),
      distributorName: z.string(),
    })
    const customer = customerSchema.parse(req.body)
    console.log(customer)
    const distributor = await prisma.distributor.findFirst({
      where: {
        name: customer.distributorName,
      },
    })
    console.log(distributor)
    try {
      if (distributor) {
        const xd = await prisma.customers.create({
          data: {
            name: customer.name,
            email: customer.email,
            address: customer.address,
            distributorId: distributor.id,
          },
        })
        console.log(xd)
      }
    } catch (error) {
      console.error(error)
      res.status(409)
    }
  })
}
