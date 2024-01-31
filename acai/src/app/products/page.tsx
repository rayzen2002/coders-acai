'use client'
import axios from 'axios'

import { Header } from '@/components/header'

import { columns } from './columns'
import { DataTable, Product } from './data-table'

export default async function Products() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_KEY}/products`, {
    cache: 'reload',
  })
  const products: Product[] = await res.json()
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
