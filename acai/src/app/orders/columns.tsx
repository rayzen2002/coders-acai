'use client'

import { DialogTitle } from '@radix-ui/react-dialog'
import { PopoverContent } from '@radix-ui/react-popover'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverTrigger } from '@/components/ui/popover'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { Product } from '../products/data-table'
type Customer = {
  id: string
  name: string
  email: string
  address: string
  distributorId: string
}
type OrderItems = {
  quantity: number
  orderId: string
  productId: string
  product: Product
}

export type Orders = {
  id: string
  total_in_cents: number
  orderId: string
  orderItem: OrderItems[]
  customerId: string
}

export const columns: ColumnDef<Orders>[] = [
  {
    accessorKey: 'id',
    header: 'id',
  },
  {
    accessorKey: 'total_in_cents',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Preço
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('total_in_cents')) / 100
      const formatted = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(amount)

      return <div className="font-medium ml-4">{formatted}</div>
    },
  },
  {
    accessorKey: 'OrderItems',
    header: 'Items',
    cell: ({ row }) => {
      const orderItems: OrderItems[] = row.getValue('OrderItems')
      console.log(`orderItems:  ${orderItems}`)
      // const xd = orderItems?.map((orderItem) => {
      return (
        <div className="flex py-2 ">
          <Dialog>
            <DialogTrigger asChild>
              <Button>Pedido</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Pedido: 1827fy2827d6h</DialogTitle>
                <DialogDescription>Detalhes do pedido</DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="text-muted-foreground">
                        Status
                      </TableCell>
                      <TableCell className="flex justify-end">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-slate-400" />
                          <span className="font-medium text-muted-foreground">
                            Pendente
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-muted-foreground">
                        Cliente
                      </TableCell>
                      <TableCell className="flex justify-end">
                        Diego Schell Fernandes
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-muted-foreground">
                        Telefone
                      </TableCell>
                      <TableCell className="flex justify-end">
                        (47) 99999-9999
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-muted-foreground">
                        E-mail
                      </TableCell>
                      <TableCell className="flex justify-end">
                        diego@rocketseat.com.br
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-muted-foreground">
                        Realizado há
                      </TableCell>
                      <TableCell className="flex justify-end">
                        há 3 minutos
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produto</TableHead>
                      <TableHead className="text-right">Qtd.</TableHead>
                      <TableHead className="text-right">Preço</TableHead>
                      <TableHead className="text-right">Subtotal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Pizza Pepperoni Família</TableCell>
                      <TableCell className="text-right">2</TableCell>
                      <TableCell className="text-right">R$ 69,90</TableCell>
                      <TableCell className="text-right">R$ 139,80</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Pizza Mussarela Família</TableCell>
                      <TableCell className="text-right">2</TableCell>
                      <TableCell className="text-right">R$ 59,90</TableCell>
                      <TableCell className="text-right">R$ 119,80</TableCell>
                    </TableRow>
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={3}>Total do pedido</TableCell>
                      <TableCell className="text-right font-medium">
                        R$ 259,60
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )
    },
  },
  {
    accessorKey: 'customerId',
    header: 'Cliente',
  },
]
