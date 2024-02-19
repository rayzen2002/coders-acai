import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { auth } from '../../lib/auth'
import { prisma } from '../../infra/prisma/database'
import axios from 'axios'

export async function createOrder(server: FastifyInstance) {
  server.post('/order', { preHandler: [auth] }, async (req, res) => {
    const orderSchema = z.object({
      customerId: z.string(),
      orderItems: z.array(
        z.object({
          productName: z.string(),
          quantity: z.number(),
        }),
      ),
    })
    const orderValues = orderSchema.parse(req.body)
    try {
      const order = await prisma.orders.create({
        data: {
          customerId: orderValues.customerId,
          total_in_cents: 0,
        },
      })
      const productsNames = orderValues.orderItems.map((orderItem) => {
        return orderItem.productName
      })
      const NonFlatproducts = await Promise.all(
        productsNames.map(async (productName) => {
          const listOfProducts = await prisma.products.findMany({
            where: {
              name: productName,
            },
          })
          return listOfProducts
        }),
      )
      const products = NonFlatproducts.flat()
      const orderItemsBodies = orderValues.orderItems.map(
        (orderItem, index) => {
          return {
            orderId: order.id,
            productId: products[index].id,
            quantity: orderItem.quantity,
          }
        },
      )

      Promise.all(
        orderItemsBodies.map((orderItemsBody) => {
          return axios.post(`http://localhost:3333/order-item`, orderItemsBody)
        }),
      )
      const totalInCentsArray = products.map((product, i) => {
        const total =
          product.price_in_cents * orderValues.orderItems[i].quantity
        return total
      })
      const totalInCents = totalInCentsArray.reduce(
        (partialSum, value) => partialSum + value,
        0,
      )
      const orderResponse = await prisma.orders.update({
        where: {
          id: order.id,
        },
        data: {
          total_in_cents: totalInCents,
        },
      })
      return res.status(201).send({ id: orderResponse.id })
    } catch (error) {
      console.error(error)
      res.status(409)
    }
  })
}
