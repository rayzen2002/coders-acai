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
import { deleteProduct } from './routes/delete-product'
import { deleteCustomer } from './routes/delete-customers'
import { getDistributor } from './routes/get-distributor'
import { createShipment } from './routes/create-shipment'
import { getShipment } from './routes/get-shipments'
import { deleteShipment } from './routes/delete-shipment'
import { deleteUser } from './routes/delete-user'
import { getOrders } from './routes/get-orders'
import { deleteOrder } from './routes/delete-order'
import { createDistributor } from './routes/create-distributors'
import { createOrder } from './routes/create-orders'
import { createOrderItems } from './routes/create-order-items'

dotenv.config()
const server = fastify()

server.register(fastifyCors, {
  origin: '*',
})

server.register(fastifyJwt, {
  secret: 'supersecret',
})

server.register(fastifyCookie, {
  secret: 'supersecretCookie',
  parseOptions: {
    sameSite: 'none',
  },
})
server.register(getCustomer)
server.register(createCustomer)
server.register(deleteCustomer)

server.register(getProducts)
server.register(createProduct)
server.register(deleteProduct)

server.register(GetMonthRevenue)
server.register(groupRoutes)

server.register(loginRoute)
server.register(userRoute)

server.register(getDistributor)
server.register(createDistributor)

server.register(createShipment)
server.register(getShipment)
server.register(deleteShipment)

server.register(deleteUser)

server.register(createOrder)
server.register(getOrders)
server.register(deleteOrder)
server.register(createOrderItems)
server.get('/', (req, res) => {
  return res.status(200).send('Hello')
})
server
  .listen({ port: 3333 })
  .then(() => {
    console.log(`🚀 HTTP Server running on port: 3333 🚀`)
  })
  .catch((error) => {
    console.error('Error starting the server:', error)
  })
export default server
