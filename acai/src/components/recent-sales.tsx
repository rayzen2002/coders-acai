import { SmilePlus, User } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Orders } from '@/app/pedidos/columns'

export function RecentSales() {
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
    <div className="space-y-8">
      {sales.slice(0, 4).map((sale) => {
        return (
          <div key={sale.id} className="flex items-center">
            <User className="h-9 w-9">
              <SmilePlus />
            </User>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">
                {sale.customer.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {sale.customer.email}
              </p>
            </div>
            <div className="ml-auto font-medium">
              {sale.type === 'Sell' ? (
                <span className="text-green-500">
                  +{sale.total_in_cents} R$
                </span>
              ) : (
                <span className="text-red-500">-{sale.total_in_cents} R$</span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
