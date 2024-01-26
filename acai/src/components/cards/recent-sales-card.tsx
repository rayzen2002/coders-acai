import { RecentSales } from '../recent-sales'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card'

export default function RecentSalesCard() {
  return (
    <>
      <Card className="col-span-6">
        <CardHeader>
          <CardTitle>Vendas recentes</CardTitle>
          <CardDescription>Você fez 256 vendas esse mês.</CardDescription>
        </CardHeader>
        <CardContent>
          <RecentSales />
        </CardContent>
      </Card>
    </>
  )
}
