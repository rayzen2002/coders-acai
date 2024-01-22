import { DollarSign } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

export default function MonthCanceledOrdersAmountCard() {
  return (
    <>
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-semibold">
            Cancelamentos (mês)
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="space-y-1">
          <span className="text-2xl font-bold tracking-tight">R$ 1.461,24</span>
          <p className="text-xs text-muted-foreground">
            <span className="text-emerald-500 dark:text-emerald-400">
              +3,22%
            </span>
            {'  '}
            em relação ao mês passado
          </p>
        </CardContent>
      </Card>
    </>
  )
}
