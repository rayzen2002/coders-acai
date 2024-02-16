'use client'

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
} from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
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
import action from '@/lib/api/actions'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}
interface CreateProductBodyApiCall {
  name: string
  description: string
  price_in_cents: number
}
export interface Product {
  id: string
  name: string
  description: string
  price_in_cents: number
}
interface ProductForm {
  id: string
  name: string
  description: string
  price_in_cents: string
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = useState({})
  const [sorting, setSorting] = useState<SortingState>([])
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      columnFilters,
      rowSelection,
      sorting,
    },
  })
  const { register, handleSubmit, reset } = useForm<ProductForm>()
  const onSubmit: SubmitHandler<ProductForm> = async (newProduct) => {
    const body: CreateProductBodyApiCall = {
      name: newProduct.name,
      description: newProduct.description,
      price_in_cents: parseInt(newProduct.price_in_cents),
    }
    console.log(JSON.stringify(body))
    await fetch(`${process.env.NEXT_PUBLIC_API_KEY}/product`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
      next: {
        tags: ['products'],
      },
    })
    action('products')
    reset()
  }

  return (
    <div>
      <div className="flex gap-4 mx-auto justify-center items-center">
        <Input
          placeholder="ID"
          className="w-32"
          value={(table.getColumn('id')?.getFilterValue() as string) ?? ''}
          onChange={(event) => {
            table.getColumn('id')?.setFilterValue(event.target.value)
          }}
        />
        <Input
          placeholder="Nome do Produto"
          className="w-52"
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) => {
            table.getColumn('name')?.setFilterValue(event.target.value)
          }}
        />

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Plus className="w-4 h-4" />
              Novo Produto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Produto</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Nome do produto"
                    className="col-span-3"
                    {...register('name')}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    description
                  </Label>
                  <Input
                    id="description"
                    placeholder="description do produto"
                    className="col-span-3"
                    {...register('description')}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="price_in_cents" className="text-right">
                    Preço
                  </Label>
                  <Input
                    id="price_in_cents"
                    placeholder="Preço"
                    className="col-span-3"
                    {...register('price_in_cents')}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Cadastrar Produto</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="rounded-md border mt-8 mx-4">
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

      <div className="flex flex-row items-center justify-center mx-6">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} de{' '}
          {table.getFilteredRowModel().rows.length} linha(s) selecionadas.
        </div>
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
  )
}
