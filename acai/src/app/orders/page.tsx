import { faker } from '@faker-js/faker'
import { ArrowDownUp, Truck } from 'lucide-react'

import { Header } from '@/components/header'

import { columns, Orders } from './columns'
import { OrderDataTable } from './order-data-table'

export default async function Shipments() {
  const getOrdersApi = await fetch(
    `${process.env.NEXT_PUBLIC_API_KEY}/orders`,
    {
      next: {
        revalidate: 1,
        tags: ['orders'],
      },
    },
  )
  const getOrders = await getOrdersApi.json()
  // console.log(getOrders.orders)
  const orders: Orders[] = getOrders.orders
  const forders = [
    {
      id: faker.string.uuid(),
      total_in_cents: faker.number.float({
        min: 100,
        max: 10000,
        fractionDigits: 2,
      }),
      orderId: faker.string.uuid(),
      customerId: faker.person.fullName(),
    },
    {
      id: faker.string.uuid(),
      customerId: faker.person.fullName(),
      total_in_cents: faker.number.float({
        min: 100,
        max: 10000,
        fractionDigits: 2,
      }),
      orderId: faker.string.uuid(),
    },
    {
      id: faker.string.uuid(),
      customerId: faker.person.fullName(),
      total_in_cents: faker.number.float({
        min: 100,
        max: 10000,
        fractionDigits: 2,
      }),
      orderId: faker.string.uuid(),
    },
  ]
  return (
    <>
      <Header />
      <div className="flex flex-col">
        <h1 className="mx-auto text-3xl py-6 flex gap-2 items-center text-muted-foreground font-bold">
          <ArrowDownUp className="w-12 h-12" />
          Pedidos
        </h1>
      </div>
      <OrderDataTable data={orders} columns={columns} />
    </>
  )
}
