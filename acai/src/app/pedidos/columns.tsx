'use client'
import { DialogTitle } from '@radix-ui/react-dialog'
import { ColumnDef } from '@tanstack/react-table'
import axios from 'axios'
import { formatDate, formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale/pt-BR'
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { toast } from '@/components/ui/use-toast'
import action from '@/lib/api/actions'

export type Customer = {
  id: string
  name: string
  email: string
  address: string
  distributorId: string
}
type OrderItems = {
  id: string
  quantity: number
  orderId: string
  productId: string
}

export type Orders = {
  id: string
  total_in_cents: number
  orderId: string
  customerId: string
  orderItem: OrderItems[]
  customer: Customer
  createdAt: Date
  type: string
}
const getProducts = (productId: string) => {
  return fetch(`${process.env.NEXT_PUBLIC_API_KEY}/products/${productId}`, {
    cache: 'force-cache',
    next: {
      tags: ['products'],
    },
  })
    .then((productReturn) => {
      if (!productReturn.ok) {
        throw new Error('Network response was not ok')
      }
      return productReturn.json()
    })
    .then((product) => {
      if (product) {
        return product
      } else {
        throw new Error('Product not found')
      }
    })
    .catch((error) => {
      console.error('Error fetching product:', error)
      throw error
    })
}

export const columns: ColumnDef<Orders>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'id',
    header: 'id',
  },
  {
    accessorKey: 'createdAt',
    header: 'Data da compra',
    cell: ({ row }) => {
      const date: Date = row.getValue('createdAt')
      const formattedDate = formatDate(date, "dd 'de' MMMM 'de' yyyy", {
        locale: ptBR,
      })
      return <div>{formattedDate}</div>
    },
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
      const customer: Customer = row.getValue('customer')
      const date: Date = row.getValue('createdAt')
      const price: number = row.getValue('total_in_cents')
      return (
        <div className="flex py-2 ">
          <Dialog>
            <DialogTrigger asChild>
              <Button>Pedido</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Pedido:</DialogTitle>
                <DialogDescription>Detalhes do pedido</DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="text-muted-foreground">
                        Cliente
                      </TableCell>
                      <TableCell className="flex justify-end">
                        {customer.name}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-muted-foreground">
                        Endereço
                      </TableCell>
                      <TableCell className="flex justify-end">
                        {customer.address}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-muted-foreground">
                        E-mail
                      </TableCell>
                      <TableCell className="flex justify-end">
                        {customer.email}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-muted-foreground">
                        Realizado há
                      </TableCell>
                      <TableCell className="flex justify-end">
                        {formatDistanceToNow(date, {
                          addSuffix: true,
                          locale: ptBR,
                        })}
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
                    {Promise.all(
                      orderItems.map((orderItem) =>
                        getProducts(orderItem.productId).then((product) => {
                          return (
                            <TableRow key={orderItem.id}>
                              <TableCell>{product?.name}</TableCell>
                              <TableCell className="text-right">
                                {orderItem.quantity}
                              </TableCell>
                              <TableCell className="text-right">
                                {new Intl.NumberFormat('pt-BR', {
                                  style: 'currency',
                                  currency: 'BRL',
                                }).format(product.price_in_cents / 100)}
                              </TableCell>
                              <TableCell className="text-right">
                                {new Intl.NumberFormat('pt-BR', {
                                  style: 'currency',
                                  currency: 'BRL',
                                }).format(
                                  orderItem.quantity *
                                    (product.price_in_cents / 100),
                                )}
                              </TableCell>
                            </TableRow>
                          )
                        }),
                      ),
                    )}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={3}>Total do pedido</TableCell>
                      {Promise.all(
                        orderItems.map((orderItem) =>
                          getProducts(orderItem.productId).then((product) => {
                            return (
                              <TableCell
                                key={orderItem.id}
                                className="text-right font-medium"
                              >
                                {new Intl.NumberFormat('pt-BR', {
                                  style: 'currency',
                                  currency: 'BRL',
                                }).format(
                                  (orderItem.quantity *
                                    product.price_in_cents) /
                                    100,
                                )}
                              </TableCell>
                            )
                          }),
                        ),
                      )}
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
    accessorKey: 'customer',
    header: 'Cliente',
    cell: ({ row }) => {
      const costumer = row.getValue<Customer>('customer')?.name
      return <div>{costumer}</div>
    },
    filterFn: 'equals',
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const order = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(order.id)}
            >
              Copiar ID do Pedido
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-500"
              onClick={async () => {
                try {
                  const orderDeleteResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_API_KEY}/orders/${order.id}`,
                    {
                      method: 'DELETE',
                      next: {
                        revalidate: 1,
                      },
                    },
                  )
                  if (orderDeleteResponse.ok) {
                    action('orders')
                    toast({
                      variant: 'default',
                      title: 'Pedido deletado com sucesso!',
                      description: `O Pedido  foi deletado`,
                    })
                  } else {
                    throw new Error()
                  }
                } catch (error) {
                  console.error(error)
                  toast({
                    variant: 'destructive',
                    title: 'Erro ao deletar Pedido!',
                    description: `O Pedido não foi deletado`,
                  })
                }
              }}
            >
              Deletar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
