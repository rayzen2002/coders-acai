'use client'
import { FileText } from 'lucide-react'

import DayOrdersAmountCard from '@/components/cards/day-orders-amount-card'
import MonthCanceledOrdersAmountCard from '@/components/cards/month-canceled-orders-amount-card'
import MonthOrdersAmountCard from '@/components/cards/month-orders-amount-card'
import MonthRevenueCard from '@/components/cards/month-revenue-card'
import PopularCustomersChart from '@/components/cards/popular-customers-chart'
import PopularProductsChart from '@/components/cards/popular-products-cart'
import RecentSalesCard from '@/components/cards/recent-sales-card'
import RevenueChart from '@/components/cards/revenue-chart'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { DatePickerWithRange } from '@/components/ui/date-range-picker'
import { pdfCreator } from '@/lib/pdf/generate-pdf'

export default function Dashboard() {
  return (
    <>
      <Header />
      <div className="flex flex-1 flex-col gap-4 p-8 pt-6">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Estatísticas </h1>
            <div className="flex gap-2">
              <DatePickerWithRange />
              <Button variant="outline" className="gap-2" onClick={pdfCreator}>
                <FileText className="w-4 h-4" />
                Download
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <MonthRevenueCard />
            <MonthOrdersAmountCard />
            <DayOrdersAmountCard />
            <MonthCanceledOrdersAmountCard />
          </div>
          <div className="grid grid-cols-9 gap-4">
            <RevenueChart />
            <PopularProductsChart />
          </div>
          <div className="grid grid-cols-9 gap-4">
            <RecentSalesCard />
            <PopularCustomersChart />
          </div>
        </div>
      </div>
    </>
  )
}
