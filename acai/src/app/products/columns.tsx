'use client'
import { ColumnDef } from '@tanstack/react-table'
import axios from 'axios'
import { MoreHorizontal } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { Product } from './data-table'

export type Products = {
  products: {
    id: string
    name: string
    description: string
    priceInCents: number
    distributorId: string | null
  }[]
}

export const columns: ColumnDef<Product>[] = [
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
    accessorKey: 'name',
    header: 'name',
  },
  {
    accessorKey: 'description',
    header: 'description',
  },
  {
    accessorKey: 'price_in_cents',
    header: 'Preço',
    cell: ({ row }) => {
      const priceInCents: number = row.getValue('price_in_cents')
      const formated = `${priceInCents} R$`
      return <div>{formated}</div>
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const product = row.original

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
              onClick={() => navigator.clipboard.writeText(product.id)}
            >
              Copiar ID do Produto
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Estatísticas</DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-500"
              onClick={async () => {
                console.log(`product/${product.id}`)
                await axios.delete(`product/${product.id}`, {
                  baseURL: 'http://localhost:3333',
                  withCredentials: true,
                })
                location.reload()
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
