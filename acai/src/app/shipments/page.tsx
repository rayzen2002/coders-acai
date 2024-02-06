import { Header } from '@/components/header'

import { column } from './columns'
import { ShipmentsDataTable } from './shipments-data-table'

export default function Shipments() {
  const data = [
    {
      id: '3333',
      description: 'zxzxczxc',
    },
    {
      id: '8888',
      description: 'zxzxczxc',
    },
  ]
  return (
    <>
      <Header />
      <div className="flex flex-col">
        <h1 className="mx-auto text-3xl py-6">Carregamentos</h1>
      </div>
      <ShipmentsDataTable data={data} columns={column} />
    </>
  )
}
