'use client'
import { useEffect, useState } from 'react'

import { Orders } from '@/app/pedidos/columns'

import { RecentSales } from '../recent-sales'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card'

export default function RecentSalesCard() {
  const [sales, setSales] = useState<Orders[]>([])
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_KEY}/orders`)
      .then((data) => {
        return data.json()
      })
      .then((sales) => {
        setSales(sales.orders)
      })
  }, [])
  return (
    <>
      <Card className="col-span-6">
        <CardHeader>
          <CardTitle>Vendas recentes</CardTitle>
          <CardDescription>
            Você fez {sales.length} vendas esse mês.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RecentSales />
        </CardContent>
      </Card>
    </>
  )
}
