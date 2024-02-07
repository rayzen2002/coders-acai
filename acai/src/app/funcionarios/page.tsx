import { Header } from '@/components/header'

export default async function Funcionarios() {
  const getEmployeesApiCall = await fetch(
    `${process.env.NEXT_PUBLIC_API_KEY}/users`,
    {
      next: {
        revalidate: 1,
        tags: ['users'],
      },
    },
  )
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      return data
    })
  console.log(getEmployeesApiCall.users[0])
  return (
    <>
      <Header />
      <div>
        <h1>Funcionarios</h1>
      </div>
    </>
  )
}
