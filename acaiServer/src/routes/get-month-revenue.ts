import { FastifyInstance } from 'fastify'
import { auth } from '../../lib/auth'
import dayjs from 'dayjs'
import { prisma } from '../../infra/prisma/database'

export async function GetMonthRevenue(server: FastifyInstance) {
  server.get(
    '/metrics/month-revenue',
    { preHandler: [auth] },
    async (req, res) => {
      const orders = await prisma.orders.groupBy({
        by: ['createdAt', 'total_in_cents'],
        orderBy: {
          createdAt: 'asc',
        },
      })

      const groupedOrders = orders.reduce((acc, order) => {
        const date = dayjs(order.createdAt).format('YYYY-MM-DD')
        if (!acc[date]) {
          acc[date] = []
        }
        acc[date].push(order)
        return acc
      }, {})

      const result = Object.values(groupedOrders)
      console.log(result)
      return res.send(result)
    },
  )
}
