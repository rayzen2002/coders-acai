import axios from 'axios'

import { Header } from '@/components/header'

import { columns, Products } from './columns'
import { DataTable, Product } from './data-table'

export default async function Products() {
  // const getProductsApiCall = await axios.get('/products', {
  //   baseURL: process.env.NEXT_PUBLIC_API_KEY,
  //   // withCredentials: true,
  // })
  const getProductsApiCall: Products = await fetch(
    `${process.env.NEXT_PUBLIC_API_KEY}/products`,
    {
      next: {
        revalidate: 1,
      },
    },
  )
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      return data
    })
  console.log(getProductsApiCall)
  const products: Product[] = getProductsApiCall.products
  console.log(products)
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
