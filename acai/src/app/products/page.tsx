'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useReducer, useState } from 'react'

import { Header } from '@/components/header'
import { getProducts } from '@/lib/data/products'

import { columns, Products } from './columns'
import { DataTable } from './data-table'

export default function Products() {
  const [products, setProducts] = useState<Products[]>([])
  useEffect(() => {
    getProducts().then((data) => {
      setProducts(data)
    })
  }, [])

  const HandleNewProductAdded = async () => {
    const newData = await getProducts()
    setProducts(newData)
  }

  return (
    <>
      <Header />
      <div className="flex flex-col">
        <h1 className="mx-auto text-3xl py-6">Produtos</h1>
      </div>

      <DataTable
        columns={columns}
        data={products}
        onNewProductAdded={HandleNewProductAdded}
      />
    </>
  )
}
