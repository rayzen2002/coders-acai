'use client'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { DateRange } from 'react-day-picker'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'
import colors from 'tailwindcss/colors'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card'
import { DatePickerWithRange } from '../ui/date-range-picker'
import { Label } from '../ui/label'
interface Statitics {
  date: string
  revenue: number
  cost: number
}
export default function RevenueChart() {
  const [statistics, setStatistics] = useState<Statitics[]>([])
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_KEY}/metrics/month-revenue`)
      .then((data) => {
        return data.json()
      })
      .then((statistics) => {
        setStatistics(statistics)
      })
  }, [])
  const [filteredOrders, setFilteredOrders] = useState<Statitics[]>([])
  const [selectedDateRange, setSelectedDateRange] = useState<
    DateRange | undefined
  >()
  const onDateRangeChange = (dateRange: DateRange | undefined) => {
    setSelectedDateRange(dateRange)
  }
  useEffect(() => {
    if (!selectedDateRange) return

    const filteredOrders = statistics.filter(
      (order) =>
        dayjs(order.date).isAfter(dayjs(selectedDateRange.from)) &&
        dayjs(order.date).isBefore(dayjs(selectedDateRange.to)),
    )

    setFilteredOrders(filteredOrders)
  }, [selectedDateRange, statistics])
  console.log(filteredOrders)
  const [isChecked, setIsChecked] = useState(false)
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked)
  }

  return (
    <Card className="col-span-6">
      <CardHeader className="flex-row items-center justify-between pb-8">
        <div className="space-y-1">
          <CardTitle className="text-base font-medium">
            Receita no período
          </CardTitle>
          <CardDescription>Receita diária no período</CardDescription>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Label className="text-muted-foreground">Período</Label>

            <DatePickerWithRange onDateRangeChange={onDateRangeChange} />
          </div>
          <input
            type="checkbox"
            checked={isChecked}
            onChange={handleCheckboxChange}
          />

          <Label htmlFor="costs" className="text-muted-foreground">
            Mostrar despesas
          </Label>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart
            data={filteredOrders.length > 2 ? filteredOrders : statistics}
            style={{ fontSize: 12 }}
          >
            <XAxis
              dataKey="date"
              tickFormatter={(date) => dayjs(date).format('DD/MM/YYYY')}
              tickLine={false}
              axisLine={false}
              dy={16}
            />
            <YAxis
              stroke="#888"
              axisLine={false}
              tickLine={false}
              width={80}
              tickFormatter={(value: number) =>
                value.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })
              }
            />
            <CartesianGrid vertical={false} className="stroke-slate-600" />
            <Line
              type="linear"
              strokeWidth={2}
              dataKey="revenue"
              stroke={colors.violet['500']}
            />
            {isChecked === true ? (
              <Line
                type="linear"
                strokeWidth={2}
                dataKey="cost"
                stroke={colors.red['500']}
              />
            ) : (
              <></>
            )}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
