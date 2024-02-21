import { Truck } from 'lucide-react'

import { Header } from '@/components/header'

import { column, Shipments, ShipmentsApi } from './columns'
import { ShipmentsDataTable } from './shipments-data-table'

export default async function Shipments() {
  try {
    const getProductsApiCall: ShipmentsApi = await fetch(
      `${process.env.NEXT_PUBLIC_API_KEY}/shipments`,
      {
        next: {
          revalidate: 1,
          tags: ['shipments'],
        },
      },
    ).then((response) => response.json())

    const shipments = getProductsApiCall.shipments

    return (
      <>
        <Header />
        <div className="flex flex-col">
          <h1 className="mx-auto text-3xl py-6 flex gap-2 items-center text-muted-foreground font-bold">
            <Truck className="w-12 h-12" />
            Carregamentos
          </h1>
        </div>
        <ShipmentsDataTable
          data={shipments ? shipments.reverse() : []}
          columns={column}
        />
      </>
    )
  } catch (error) {
    console.error(error)
    return null
  }
}
