import axios from 'axios'

import { Header } from '@/components/header'

import { columns } from './columns'
import { DataTable, Product } from './data-table'

export default async function Products() {
  const getProductsApiCall = await axios.get('/products', {
    baseURL: process.env.NEXT_PUBLIC_API_KEY,
    withCredentials: true,
  })
  const products: Product[] = getProductsApiCall.data.products
  return (
    <>
      <Header />
      <div className="flex flex-col">
        <h1 className="mx-auto text-3xl py-6">Produtos</h1>
      </div>

      <DataTable columns={columns} data={products} />
    </>
  )
}
