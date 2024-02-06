import { faker } from '@faker-js/faker'

import { Header } from '@/components/header'

import { columns } from './columns'
import { CustomersDataTable } from './data-table'

export interface Customers {
  id: string
  name: string
  email: string
  address: string
  distributorId: string
}
export interface ApiCustomers {
  customers: {
    id: string
    name: string
    email: string
    address: string
    distributorId: string
  }[]
}
const createRandomCustomer = () => {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    address: faker.location.streetAddress(),
    distributorId: faker.company.name(),
  }
}

const randomCustommers = faker.helpers.multiple(createRandomCustomer, {
  count: 5,
})

export default async function Customers() {
  const apiCustomers: ApiCustomers = await fetch(
    `${process.env.NEXT_PUBLIC_API_KEY}/customers`,
    {
      next: {
        revalidate: 1,
        tags: ['customers'],
      },
    },
  )
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      return data
    })
  return (
    <>
      <Header />
      <div className="flex flex-col">
        <h1 className="mx-auto text-3xl py-6">Clientes</h1>
      </div>

      <CustomersDataTable
        columns={columns}
        data={[...randomCustommers, ...apiCustomers.customers]}
      />
    </>
  )
}
