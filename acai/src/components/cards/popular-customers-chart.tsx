'use client'
import { BarChart as BarChartIcon } from 'lucide-react'
import { useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import colors from 'tailwindcss/colors'

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Label } from '../ui/label'

const data = [
  {
    name: 'Cliente A',
    produto: 2000,
    total: 2400,
  },
  {
    name: 'Cliente B',
    produto: 1000,
    total: 1398,
  },
  {
    name: 'Cliente C',
    produto: 3000,
    total: 5500,
  },
  {
    name: 'Cliente D',
    produto: 2780,
    total: 3908,
  },
  {
    name: 'Cliente E',
    produto: 1890,
    total: 4800,
  },
]
export default function PopularCustomersChart() {
  const [isChecked, setIsChecked] = useState(false)
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked) // Toggle the state
  }
  return (
    <Card className="col-span-3">
      <CardHeader className="pb-8">
        <div className="grid grid-cols-2"></div>
        <div className="flex items-center justify-between ">
          <CardTitle className="text-base font-medium">
            Clientes populares
          </CardTitle>
          <div className="flex gap-1">
            <div className="flex gap-2">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={handleCheckboxChange}
              />
              <Label htmlFor="costs">Produto mais consumido</Label>
            </div>
          </div>
          <BarChartIcon className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart
            style={{ fontSize: 12 }}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid className="stroke-slate-600" />
            <XAxis dataKey="name" tickLine={false} axisLine={false} dy={16} />
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
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} align="left" />
            <Bar
              dataKey="total"
              fill={colors.lime['600']}
              activeBar={<Rectangle fill="pink" stroke="blue" />}
            />
            {isChecked === true ? (
              <Bar
                dataKey="produto"
                fill={colors.violet['600']}
                activeBar={<Rectangle fill="gold" stroke="purple" />}
              />
            ) : (
              <></>
            )}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
