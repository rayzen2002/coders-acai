'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'

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
import { toast } from '@/components/ui/use-toast'
import action from '@/lib/api/actions'

export interface Shipments {
  id: string
  temperature: number
  origin: string
  destiny: string
  fuelPriceInCents: number
  // userId: string | null
}
export interface ShipmentsApi {
  shipments: {
    id: string
    temperature: number
    origin: string
    destiny: string
    fuelPriceInCents: number
    userId: string | null
  }[]
}

export const column: ColumnDef<Shipments>[] = [
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
    accessorKey: 'temperature',
    header: () => <div className="text-left">Temperatura</div>,
    cell: ({ row }) => {
      const temperature = parseFloat(row.getValue('temperature'))
      const formatted = new Intl.NumberFormat('pt-BR', {
        style: 'unit',
        unit: 'celsius',
      }).format(temperature)

      return <div className="text-left font-medium mx-4">{formatted}</div>
    },
  },
  {
    accessorKey: 'origin',
    header: 'Origem',
  },
  {
    accessorKey: 'destiny',
    header: 'Destino',
  },
  {
    accessorKey: 'fuelPriceInCents',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-medium "
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === 'asc')
          }}
        >
          Preço
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('fuelPriceInCents')) / 100
      const formatted = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(amount)

      return <div className="font-medium">{formatted}</div>
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const shipment = row.original

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
              onClick={() => navigator.clipboard.writeText(shipment.id)}
            >
              Copiar Id
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem
              onClick={async () => {
                try {
                  const deleteShipmentRequest = await fetch(
                    `${process.env.NEXT_PUBLIC_API_KEY}/shipments/${shipment.id}`,
                    {
                      method: 'DELETE',
                    },
                  )
                  if (deleteShipmentRequest.ok) {
                    action('shipments')
                    toast({
                      className: 'bg-green-500',
                      title: 'Carga deletada com sucesso!',
                    })
                    action('shipments')
                  } else {
                    throw new Error()
                  }
                } catch (error) {
                  console.error(error)
                  toast({
                    className: 'bg-red-500',
                    title: 'Não foi possivel deletar!',
                  })
                }
              }}
              className="text-red-600"
            >
              Deletar viagem
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
