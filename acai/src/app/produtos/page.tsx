import { faker } from '@faker-js/faker'

import { Header } from '@/components/header'

import { columns, Products } from './columns'
import { DataTable, Product } from './data-table'

interface FakeProducts {
  id: string
  name: string
  description: string
  price_in_cents: number
  distributorId: string | null
}
const createRandomProduct = (): FakeProducts => {
  return {
    id: faker.string.uuid(),
    description: faker.commerce.productDescription(),
    distributorId: faker.company.name(),
    name: faker.commerce.productName(),
    price_in_cents: faker.number.int({ min: 1000, max: 5000 }),
  }
}

const randomProducts = faker.helpers.multiple(createRandomProduct, {
  count: 5,
})
export default async function Products() {
  const getProductsApiCall: Products = await fetch(
    `${process.env.NEXT_PUBLIC_API_KEY}/products`,
    {
      next: {
        revalidate: 1,
        tags: ['products'],
      },
    },
  )
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      return data
    })
  const products: Product[] = getProductsApiCall.products
  return (
    <>
      <Header />
      <div className="flex flex-col">
        <h1 className="mx-auto text-3xl py-6">Produtos</h1>
      </div>

      <DataTable columns={columns} data={[...products]} />
    </>
  )
}
