import { FastifyInstance } from 'fastify'
import { auth } from '../../lib/auth'
import dayjs from 'dayjs'
import { prisma } from '../../infra/prisma/database'

interface Order {
  date: Date
  revenue: number
  cost: number
}
export async function GetMonthRevenue(server: FastifyInstance) {
  server.get(
    '/metrics/month-revenue',
    { preHandler: [auth] },
    async (req, res) => {
      const orders = await prisma.orders.groupBy({
        by: ['createdAt', 'total_in_cents', 'type'],
        orderBy: {
          createdAt: 'asc',
        },
      })

      const groupedOrders = orders.reduce((acc, order) => {
        const date = dayjs(order.createdAt).format('YYYY-MM-DD')
        if (!acc[date]) {
          acc[date] = []
        }
        if (order.type === 'Sell') {
          acc[date].push({
            date: dayjs(order.createdAt).format('DD/MM/YYYY'),
            revenue: order.total_in_cents,
            cost: 0,
          })
        }
        if (order.type === 'Buy') {
          acc[date].push({
            date: dayjs(order.createdAt).format('DD/MM/YYYY'),
            revenue: 0,
            cost: order.total_in_cents,
          })
        }

        return acc
      }, {})
      const result: Order[][] = Object.values(groupedOrders)

      const xd = result.map((orders) => {
        let revenue = 0
        let cost = 0

        orders.forEach((order) => {
          revenue += order.revenue
          cost += order.cost
        })
        return {
          date: orders[0].date,
          revenue,
          cost,
        }
      })
      return res.send(xd)
    },
  )
}
