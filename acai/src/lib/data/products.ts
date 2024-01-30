import { faker } from '@faker-js/faker'

import { Products } from '@/app/products/columns'
const products: Products[] = []
export function createData(): Products {
  return {
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    status: faker.finance.transactionType(),
    weight: parseFloat(faker.number.float({ min: 0.5, max: 2 }).toFixed(2)),
    stock: faker.number.int({ min: 10, max: 500 }),
  }
}
export async function getProducts() {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const fakeData: Products[] = faker.helpers.multiple(createData, {
    count: 50,
  })
  if (products.length === 0) {
    products.push(...fakeData)
  }

  return products
}

export async function createProduct({ name, status, weight, stock }: Products) {
  const newProduct: Products = {
    id: faker.string.uuid(),
    name,
    status,
    weight,
    stock,
  }
  const products = await getProducts()
  products.push(newProduct)
  return newProduct
}
