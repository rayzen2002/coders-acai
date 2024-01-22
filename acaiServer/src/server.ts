import dotenv from 'dotenv'
import fastify from 'fastify'
import { userRoute } from './routes/route'
import fastifyJwt from '@fastify/jwt'
import { loginRoute } from './routes/login'
import fastifyCookie from '@fastify/cookie'
import { groupRoutes } from './routes/group'
import fastifyCors from '@fastify/cors'
import { GetMonthRevenue } from './routes/get-month-revenue'
import { createProduct } from './routes/create-product'

dotenv.config()
export const server = fastify()

server.register(fastifyCors, {
  origin: 'https://coders-acai.vercel.app',
  credentials: true,
})
server.register(fastifyJwt, {
  secret: 'supersecret',
})
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
