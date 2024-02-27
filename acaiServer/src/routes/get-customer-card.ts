import { FastifyInstance } from 'fastify'
import { auth } from '../../lib/auth'
import { prisma } from '../../infra/prisma/database'
import dayjs from 'dayjs'

export async function getCustomerCard(server: FastifyInstance) {
  server.get('/customers-card', { preHandler: [auth] }, async (req, res) => {
    const actualMonth = dayjs()
    try {
      const customersDb = await prisma.customers.findMany({
        include: {
          Orders: {
            include: {
              OrderItems: {
                include: {
                  product: true,
                },
              },
            },
          },
        },
      })
      const distributor = await prisma.distributor.findFirst()
      if (distributor) {
        const customersWithFilteredOrders = customersDb
          .filter((customer) =>
            customer.Orders.some((order) => order.type === 'Buy'),
          )
          .map((customer) => {
            const filteredOrders = customer.Orders.filter(
              (order) => dayjs(order.createdAt).month === actualMonth.month,
            )
            return {
              name: customer.name,
              produto: filteredOrders[0].OrderItems[0].product.price_in_cents,
              total: filteredOrders[0].total_in_cents,
            }
          })
        customersWithFilteredOrders.sort((a, b) => b.total - a.total)
        const top5Customers = customersWithFilteredOrders.slice(0, 3)
        return top5Customers
      } else {
        throw new Error('Sem distribuidores')
      }
    } catch (error) {
      console.error(error)
      res.status(409)
    }
  })
}
export default getCustomerCard
