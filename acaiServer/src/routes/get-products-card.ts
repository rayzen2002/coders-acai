import { FastifyInstance } from 'fastify'
import { auth } from '../../lib/auth'
import { prisma } from '../../infra/prisma/database'
import dayjs from 'dayjs'

export async function getProductsCard(server: FastifyInstance) {
  server.get('/products-card', { preHandler: [auth] }, async (req, res) => {
    const actualMonth = dayjs()

    const productsDb = await prisma.products.findMany({
      include: {
        OrderItems: true,
      },
    })
    productsDb.sort((a, b) => b.OrderItems.length - a.OrderItems.length)
    const popularProductsCard = productsDb.slice(0, 5)
    const popularProductsCardResponse = popularProductsCard.map((product) => {
      return {
        product: product.name,
        amount: product.OrderItems.length,
      }
    })
    res.status(200).send(popularProductsCardResponse)
  })
}
export default getProductsCard
