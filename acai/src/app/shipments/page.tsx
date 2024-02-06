import { Header } from '@/components/header'

import { column, Shipments, ShipmentsApi } from './columns'
import { ShipmentsDataTable } from './shipments-data-table'

export default async function Shipments() {
  const data: Shipments[] = [
    {
      id: '3333',
      temperature: 20,
      origin: 'Belem-PA',
      destiny: 'Sobral-CE',
      fuelPriceInCents: 10000,
    },
    {
      id: '6666',
      temperature: 15,
      origin: 'Tailandia-PA',
      destiny: 'Sobral-CE',
      fuelPriceInCents: 15000,
    },
    {
      id: '9999',
      temperature: -5,
      origin: 'Amazonas-AM',
      destiny: 'Sobral-CE',
      fuelPriceInCents: 8000,
    },
  ]
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
  console.log(shipments)
  return (
    <>
      <Header />
      <div className="flex flex-col">
        <h1 className="mx-auto text-3xl py-6">Carregamentos</h1>
      </div>
      <ShipmentsDataTable data={[...data, ...shipments]} columns={column} />
    </>
  )
}
