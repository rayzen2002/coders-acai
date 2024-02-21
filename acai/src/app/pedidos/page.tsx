import { ArrowDownUp } from 'lucide-react'

import { Header } from '@/components/header'

import { columns, Orders } from './columns'
import { OrderDataTable } from './order-data-table'

export default async function Shipments() {
  try {
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
    const orders: Orders[] = getOrders.orders

    return (
      <>
        <Header />
        <div className="flex flex-col">
          <h1 className="mx-auto text-3xl py-6 flex gap-2 items-center text-muted-foreground font-bold">
            <ArrowDownUp className="w-12 h-12" />
            Pedidos
          </h1>
        </div>
        <OrderDataTable
          data={orders ? orders.reverse() : []}
          columns={columns}
        />
      </>
    )
  } catch (error) {
    console.error(error)
    return <h1>Error</h1>
  }
}
