import { faker } from '@faker-js/faker'
import { Truck } from 'lucide-react'

import { Header } from '@/components/header'

import { column, Shipments, ShipmentsApi } from './columns'
import { ShipmentsDataTable } from './shipments-data-table'

export default async function Shipments() {
  const createRandomShipment = (): Shipments => {
    return {
      id: faker.string.uuid(),
      temperature: faker.number.float({ min: -10, max: 30, fractionDigits: 2 }),
      origin: faker.location.city(),
      destiny: faker.location.city(),
      fuelPriceInCents: faker.number.int({ min: 10000, max: 100000 }),
    }
  }

  const randomShipments = faker.helpers.multiple(createRandomShipment, {
    count: 5,
  })

  const getProductsApiCall: ShipmentsApi = await fetch(
    `${process.env.NEXT_PUBLIC_API_KEY}/shipments`,
    {
      next: {
        revalidate: 1,
        tags: ['shipments'],
      },
    },
  )
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      return data
    })
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
        data={[...randomShipments, ...shipments].reverse()}
        columns={column}
      />
    </>
  )
}
