import { FastifyInstance } from 'fastify'
import { auth } from '../../lib/auth'
import dayjs from 'dayjs'
import { prisma } from '../../infra/prisma/database'

export async function GetMonthRevenue(server: FastifyInstance) {
  server.get('/metrics/month-revenue', { preHandler: [auth] }, async (req) => {
    const today = dayjs()
    const lastMonth = today.subtract(1, 'month')
    const startOfLastMonth = lastMonth.startOf('month')

    const lastMonthWithYear = lastMonth.format('YYYY-MM')
    const currentMonthWithYear = today.format('YYYY-MM')

    const monthRevenue = await prisma.orders.groupBy({
      by: 'customerId',
      _sum: {
        total_in_cents: true,
      },
    })
    return monthRevenue
  })
}
