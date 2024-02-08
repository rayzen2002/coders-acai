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
  const funcionarios: Functionary[] = [
    {
      id: '3333',
      username: 'Funcionario A',
      groups: [
        {
          groupName: 'Grupo A',
          levelOfAccess: 5,
        },
      ],
    },
    {
      id: '6666',
      username: 'Funcionario B',
      groups: [
        {
          groupName: 'Grupo B',
          levelOfAccess: 5,
        },
      ],
    },
    {
      id: '9999',
      username: 'Funcionario C',
      groups: [
        {
          groupName: 'Grupo C',
          levelOfAccess: 5,
        },
      ],
    },
  ]
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
      <div>
        <h1>Funcionarios</h1>
      </div>
      <UsersDataTable
        columns={columns}
        data={[...funcionarios, ...employees.users]}
      />
    </>
  )
}
