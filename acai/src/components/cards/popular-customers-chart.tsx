'use client'
import { BarChart as BarChartIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
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
  const [customers, setCustomers] = useState([])
  const [isChecked, setIsChecked] = useState(false)
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked)
  }
  try {
    useEffect(() => {
      fetch(`${process.env.NEXT_PUBLIC_API_KEY}/customers-card`)
        .then((data) => {
          return data.json()
        })
        .then((customers) => {
          setCustomers(customers)
        })
    }, [])
  } catch (error) {
    console.error(error)
  }
  console.log(customers)
  return (
    <Card className="col-span-3">
      <CardHeader className="pb-8">
        <div className="grid grid-cols-2"></div>
        <div className="flex items-center justify-between ">
          <CardTitle className="text-base font-medium">
            Clientes populares do mês
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
            data={customers}
            margin={{
              top: 5,
              right: 0,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid className="stroke-slate-600" />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              dy={16}
              fontSize={12}
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
