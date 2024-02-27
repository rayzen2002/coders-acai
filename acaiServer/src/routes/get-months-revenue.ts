import dayjs from 'dayjs'
import { FastifyInstance } from 'fastify'
import { prisma } from '../../infra/prisma/database'

interface newOrders {
  revenue: number
  month: string
  year: string
}
export async function getMonthTotalRevenue(server: FastifyInstance) {
  server.get('/metrics/month-total-revenue', async (_, res) => {
    const date = dayjs()
    const actualMonth = date.format('MM')
    const lastMonth = date.subtract(1, 'M').format('MM')
    const actualYear = date.format('YYYY')
    const orders = await prisma.orders.findMany()
    const newOrders: newOrders[] = []

    orders.forEach((order) => {
      if (
        (dayjs(order.createdAt).format('MM') === actualMonth &&
          dayjs(order.createdAt).format('YYYY') === actualYear) ||
        (dayjs(order.createdAt).format('MM') === lastMonth &&
          dayjs(order.createdAt).format('YYYY') === actualYear)
      ) {
        newOrders.push({
          revenue: order.total_in_cents,
          month: dayjs(order.createdAt).format('MM'),
          year: dayjs(order.createdAt).format('YYYY'),
        })
      }
    })
    let totalRevenueForActualMonth = 0
    let totalRevenueForLastMonth = 0
    return res.status(200).send(newOrders)
    const ordersForCard: newOrders[] = newOrders.reduce(
      (ordersForCard: newOrders[], order) => {
        if (order.month === dayjs().format('MM')) {
          totalRevenueForActualMonth =
            totalRevenueForActualMonth + order.revenue
          ordersForCard[0] = {
            revenue: totalRevenueForActualMonth,
            month: dayjs().format('MM'),
            year: dayjs().format('YYYY'),
          }
        } else if (
          parseInt(order.month) ===
          parseInt(dayjs().subtract(1, 'M').format('MM'))
        ) {
          totalRevenueForLastMonth = totalRevenueForLastMonth + order.revenue
          ordersForCard[1] = {
            revenue: totalRevenueForLastMonth,
            month: dayjs().subtract(1, 'M').format('MM'),
            year: dayjs().format('YYYY'),
          }
        }

        return ordersForCard
      },
      [],
    )
    return res.status(200).send(ordersForCard)
  })
}
export default getMonthTotalRevenue
