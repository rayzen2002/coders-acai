'use client'
import { useState } from 'react'
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

const data = [
  {
    date: '05/02',
    revenue: 1000,
    cost: 750,
  },
  {
    date: '06/02',
    revenue: 1500,
    cost: 800,
  },
  {
    date: '07/02',
    revenue: 800,
    cost: 1200,
  },
  {
    date: '08/02',
    revenue: 2500,
    cost: 1500,
  },
  {
    date: '09/02',
    revenue: 700,
    cost: 500,
  },
  {
    date: '10/02',
    revenue: 500,
    cost: 1800,
  },
]
export default function RevenueChart() {
  const [isChecked, setIsChecked] = useState(false)
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked) // Toggle the state
  }
  console.log(isChecked)
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

            <DatePickerWithRange />
          </div>
          <input
            type="checkbox"
            checked={isChecked}
            onChange={handleCheckboxChange}
          />

          <Label htmlFor="costs" className="text-muted-foreground">
            Mostrar despesas
          </Label>
          {/* <DateRangePicker /> */}
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={data} style={{ fontSize: 12 }}>
            <XAxis dataKey="date" tickLine={false} axisLine={false} dy={16} />
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
