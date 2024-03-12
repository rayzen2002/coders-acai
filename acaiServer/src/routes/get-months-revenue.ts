import { FastifyInstance } from 'fastify'
import { auth } from '../../lib/auth'
import dayjs from 'dayjs'
import { prisma } from '../../infra/prisma/database'

interface Order {
  date: Date
  revenue: number
  cost: number
}
export async function GetMonthTotalRevenue(server: FastifyInstance) {
  server.get(
    '/metrics/month-total-revenue',
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
            date: dayjs(order.createdAt),
            revenue: order.total_in_cents,
            cost: 0,
          })
        }
        if (order.type === 'Buy') {
          acc[date].push({
            date: dayjs(order.createdAt),
            revenue: 0,
            cost: order.total_in_cents,
          })
        }

        return acc
      }, {})
      const result: Order[][] = Object.values(groupedOrders)

      const newOrderStructure = result.map((orders) => {
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
      const ordersFromThisMonth = newOrderStructure.filter((order) => {
        return (
          (dayjs(order.date).month() === dayjs().month() &&
            dayjs(order.date).year() === dayjs().year()) ||
          (dayjs(order.date).month() === dayjs().subtract(1, 'M').month() &&
            dayjs(order.date).year() === dayjs().year())
        )
      })
      const sumReducer = (acc, entry) => {
        acc.revenue += entry.revenue
        acc.cost += entry.cost
        return acc
      }

      const month1Data = ordersFromThisMonth
        .filter((entry) => new Date(entry.date).getMonth() === dayjs().month())
        .reduce(sumReducer, { revenue: 0, cost: 0 })

      const month2Data = ordersFromThisMonth
        .filter(
          (entry) => new Date(entry.date).getMonth() === dayjs().month() - 1,
        )
        .reduce(sumReducer, { revenue: 0, cost: 0 })

      const response = [month2Data, month1Data]
      console.log(response)
      return res.send(response)
    },
  )
}
export default GetMonthTotalRevenue
