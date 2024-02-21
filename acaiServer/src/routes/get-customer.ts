import { FastifyInstance } from 'fastify'
import { auth } from '../../lib/auth'
import { prisma } from '../../infra/prisma/database'

export async function getCustomer(server: FastifyInstance) {
  server.get('/customers', { preHandler: [auth] }, async (req, res) => {
    try {
      const customersDb = await prisma.customers.findMany()
      const distributor = await prisma.distributor.findFirst()
      if (distributor) {
        const customers = customersDb.map((customer) => {
          customer.distributorId = distributor.name
          return customer
        })
        return { customers }
      } else {
        throw new Error('Sem distribuidores')
      }
    } catch (error) {
      console.error(error)
      res.status(409)
    }
  })
}
