import DayOrdersAmountCard from '@/components/cards/day-orders-amount-card'
import MonthCanceledOrdersAmountCard from '@/components/cards/month-canceled-orders-amount-card'
import MonthOrdersAmountCard from '@/components/cards/month-orders-amount-card'
import MonthRevenueCard from '@/components/cards/month-revenue-card'
import PopularProductsChart from '@/components/cards/popular-products-cart'
import RevenueChart from '@/components/cards/revenue-chart'
import { Header } from '@/components/header'

export default function Dashboard() {
  return (
    <>
      <Header />
      <div className="flex flex-1 flex-col gap-4 p-8 pt-6">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
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
        </div>
      </div>
    </>
  )
}
