'use client'
import { DollarSign } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
interface MonthRevenue {
  revenue: number
  month: string
  year: string
}
export default function MonthRevenueCard() {
  const [monthRevenue, setMonthRevenue] = useState<MonthRevenue[]>([])
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_KEY}/metrics/month-total-revenue`)
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        setMonthRevenue(data)
      })
  }, [])
  if (monthRevenue[0]) {
    const percentualAgainstLastMonth: number =
      100 *
      ((monthRevenue[0]?.revenue - monthRevenue[1]?.revenue) /
        monthRevenue[1]?.revenue)
    return (
      <>
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold">
              Receita total (mês)
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-1">
            <span className="text-2xl font-bold tracking-tight">
              R$ {monthRevenue[0]?.revenue}
            </span>
            <p className="text-xs text-muted-foreground">
              <span>
                {percentualAgainstLastMonth > 0 ? (
                  <span className="text-emerald-500 dark:text-emerald-400">
                    +{percentualAgainstLastMonth.toFixed(2)}%
                  </span>
                ) : (
                  <span className="text-red-500 dark:text-red-400">
                    {percentualAgainstLastMonth.toFixed(2)}%
                  </span>
                )}
              </span>
              {'  '}
              em relação ao mês passado
            </p>
          </CardContent>
        </Card>
      </>
    )
  } else {
    return <h1>No Data</h1>
  }
}
