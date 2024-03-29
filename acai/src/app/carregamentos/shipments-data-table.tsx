'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table'
import { PlusCircle } from 'lucide-react'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { toast } from '@/components/ui/use-toast'
import action from '@/lib/api/actions'

interface Shipment {
  temperature: number
  origin: string
  destiny: string
  fuelPriceInCents: number
}
const ShipmentSchema = z.object({
  id: z.string().uuid({ message: 'ID inválido' }).optional(),
  temperature: z.coerce
    .number({ invalid_type_error: 'Temperatura inválida' })
    .min(1, { message: 'Temperatura inválida' }),
  origin: z
    .string({ required_error: 'Origem inválida' })
    .min(2, { message: 'Origem inválida' }),
  destiny: z
    .string({ required_error: 'Destino inválida' })
    .min(2, { message: 'Destino inválido' }),
  fuelPriceInCents: z
    .string({ invalid_type_error: 'Preço deve ser um número' })
    .min(1, { message: 'valor inválido' }),
  userId: z.string().optional(),
})
type ShipmentsValues = z.infer<typeof ShipmentSchema>
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function ShipmentsDataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const options = ['id', 'Temperatura', 'Origem', 'Destino', 'Preço', 'Ação']
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })
  const transformPrice = (string: string) => {
    if (!string.includes(',')) {
      return parseFloat(string) * 100
    }
    const newString = string.replace(',', '.')
    return parseFloat(newString) * 100
  }
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ShipmentsValues>({
    resolver: zodResolver(ShipmentSchema),
  })

  const onSubmit: SubmitHandler<ShipmentsValues> = async (newShipment) => {
    const price = newShipment.fuelPriceInCents
    const bodyPrice = transformPrice(price)
    const body: Shipment = {
      destiny: newShipment.destiny,
      origin: newShipment.origin,
      temperature: newShipment.temperature,
      fuelPriceInCents: bodyPrice,
    }
    try {
      const shipmentResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_KEY}/shipment`,
        {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            'Content-Type': 'application/json',
          },
          next: {
            tags: ['shipments'],
          },
        },
      )
      if (shipmentResponse.ok) {
        toast({
          className: 'bg-green-700',
          title: 'Cadastro realizado com sucesso!',
        })
        action('shipments')
        reset()
      } else {
        throw new Error()
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Falha no cadastro!',
      })
      reset()
    }
  }

  return (
    <div className="mx-4">
      <div className="flex flex-row mx-auto gap-6 justify-center items-center">
        <div className="flex items-center py-4 ">
          <Input
            placeholder="Filtrar por id"
            value={(table.getColumn('id')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('id')?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
        <div className="flex items-center py-4 ">
          <Input
            placeholder="Filtrar por origem"
            value={
              (table.getColumn('origin')?.getFilterValue() as string) ?? ''
            }
            onChange={(event) =>
              table.getColumn('origin')?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
        <div className="flex items-center py-4 ">
          <Input
            placeholder="Filtrar destinos..."
            value={
              (table.getColumn('destiny')?.getFilterValue() as string) ?? ''
            }
            onChange={(event) =>
              table.getColumn('destiny')?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="ml-6 gap-1">
                <PlusCircle className="w-4 h-4" />
                Novo Carregamento
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Carregamento</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Temperatura
                    </Label>
                    <Input
                      id="name"
                      placeholder="Temperatura média da carga"
                      className="col-span-3"
                      {...register('temperature')}
                    />
                    {errors.temperature && (
                      <span className="w-[400px] text-red-700">
                        {errors.temperature.message}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Origem
                    </Label>
                    <Input
                      id="origin"
                      placeholder="Local de Origem da Carga"
                      className="col-span-3"
                      {...register('origin')}
                    />
                    {errors.origin && (
                      <span className="text-red-700 w-[400px]">
                        {errors.origin.message}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Destino
                    </Label>
                    <Input
                      id="destiny"
                      placeholder="Local de Destino da Carga"
                      className="col-span-3"
                      {...register('destiny')}
                    />
                    {errors.destiny && (
                      <span className="text-red-700 w-[400px]">
                        {errors.destiny.message}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Combustível
                    </Label>
                    <Input
                      id="fuelPriceInCents"
                      placeholder="Valor gasto com combustível"
                      className="col-span-3"
                      {...register('fuelPriceInCents')}
                    />
                    {errors.fuelPriceInCents && (
                      <span className="text-red-700 w-[400px]">
                        {errors.fuelPriceInCents.message}
                      </span>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Cadastrar Produto</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-6">
                Campos
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column, i) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {options[i]}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border ">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-row items-center justify-center ">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} de{' '}
          {table.getFilteredRowModel().rows.length} linha(s) selecionadas.
        </div>
        <div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
