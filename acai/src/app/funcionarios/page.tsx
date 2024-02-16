import { faker } from '@faker-js/faker'
import { Users } from 'lucide-react'

import { Header } from '@/components/header'

import { columns, Functionary } from './columns'
import { UsersDataTable } from './users-data-table'

interface EmployesAPI {
  id: string
  username: string
  groups: {
    groupName: string
    levelOfAccess: number
  }[]
}
interface UsersAPI {
  users: EmployesAPI[]
}
export default async function Funcionarios() {
  const createRandomUser = (): Functionary => {
    return {
      id: faker.string.uuid(),
      username: faker.person.fullName(),
      groups: [
        {
          groupName: faker.person.jobTitle(),
          levelOfAccess: faker.number.int({ min: 1, max: 4 }),
        },
      ],
    }
  }
  const randomUsers = faker.helpers.multiple(createRandomUser, {
    count: 5,
  })

  const getEmployeesApiCall = await fetch(
    `${process.env.NEXT_PUBLIC_API_KEY}/users`,
    {
      next: {
        revalidate: 1,
        tags: ['users'],
      },
    },
  )
  const employees: UsersAPI = await getEmployeesApiCall.json()
  return (
    <>
      <Header />
      <div className="flex flex-col">
        <div className="flex justify-center items-center">
          <h1 className="mx-auto text-3xl py-6 flex gap-2 items-center text-muted-foreground font-bold">
            <Users className="w-12 h-12" />
            Funcionários
          </h1>
        </div>
      </div>
      <div className="px-6">
        <UsersDataTable
          columns={columns}
          data={[...randomUsers, ...employees.users]}
        />
      </div>
    </>
  )
}
