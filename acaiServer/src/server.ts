import dotenv from 'dotenv'
import fastify from 'fastify'
import { userRoute } from './routes/route'
import fastifyJwt from '@fastify/jwt'
import { loginRoute } from './routes/login'
import fastifyCookie from '@fastify/cookie'
import { groupRoutes } from './routes/group'
import fastifyCors from '@fastify/cors'
import { GetMonthRevenue } from './routes/get-month-revenue'
import { createCustomer } from './routes/create-customer'
import { getProducts } from './routes/get-products'
import { createProduct } from './routes/create-product'
import { getCustomer } from './routes/get-customer'

dotenv.config()
export const server = fastify()

server.register(fastifyCors, {
  origin: 'http://localhost:3000',
  credentials: true,
})
server.register(fastifyJwt, {
  secret: 'supersecret',
})
server.register(getCustomer)
server.register(createCustomer)
server.register(getProducts)
server.register(createProduct)
server.register(GetMonthRevenue)
server.register(groupRoutes)
server.register(fastifyCookie, {
  secret: 'supersecretCookie',
  parseOptions: {
    sameSite: 'none',
  },
})
server.register(loginRoute)
server.register(userRoute)

server.listen({ port: 3333 }).then(() => {
  console.log(`Server running on port 3333`)
})
