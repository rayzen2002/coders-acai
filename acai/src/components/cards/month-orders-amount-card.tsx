import dayjs from 'dayjs'
import { Utensils } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
interface order {
  revenue: number
  date: string
  cost: string
}
export default function MonthOrdersAmountCard() {
  const [monthRevenue, setMonthRevenue] = useState<order[]>([])
  try {
    useEffect(() => {
      fetch(`${process.env.NEXT_PUBLIC_API_KEY}/metrics/month-revenue`)
        .then((data) => {
          return data.json()
        })
        .then((monthRevenue) => {
          setMonthRevenue(monthRevenue)
        })
    }, [])
  } catch (error) {
    console.error(error)
  }
  const actualMonth = monthRevenue.filter((order) => {
    return dayjs(order.date).month() === dayjs().month()
  })
  const lastMonth = monthRevenue.filter((order) => {
    return dayjs(order.date).month() === dayjs().month() - 1
  })

  const diff =
    ((actualMonth.length - lastMonth.length) /
      (actualMonth.length + lastMonth.length)) *
    100

  return (
    <>
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-semibold">
            Pedidos (mês)
          </CardTitle>
          <Utensils className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="space-y-1">
          <span className="text-2xl font-bold tracking-tight">
            {actualMonth.length}
          </span>
          <p className="text-xs text-muted-foreground">
            {diff > 0 ? (
              <span className="text-emerald-500 dark:text-emerald-400">
                {diff.toFixed(2)}%
              </span>
            ) : (
              <span className="text-red-500 dark:text-emerald-400">
                {diff}%
              </span>
            )}
            {'  '}
            em relação ao mês passado
          </p>
        </CardContent>
      </Card>
    </>
  )
}
