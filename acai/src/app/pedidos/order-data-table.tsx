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
import { Check, PlusCircle, Store } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
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
import { cn } from '@/lib/utils'

interface ProductsArray {
  id: string
  name: string
  description: string
  price_in_cents: number
  distributorId: string | null
}
interface Customer {
  id: string
  name: string
  email: string
  address: string
  distributorId: string
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}
const CreatingOrderFormSchema = z.object({
  customer: z.string(),
  orderItems: z.array(
    z.object({
      productName: z.string(),
      quantity: z.string(),
    }),
  ),
})

type CreatingOrderFormValues = z.infer<typeof CreatingOrderFormSchema>
const OrderSchema = z.object({
  id: z.string(),
  total_in_cents: z.number(),
  orderId: z.string(),
  customerId: z.string(),
  orderItem: z.array(
    z.object({
      id: z.string(),
      quantity: z.number(),
      orderId: z.string(),
      productId: z.string(),
    }),
  ),
  customer: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    address: z.string(),
    distributorId: z.string(),
  }),
  createdAt: z.date().default(new Date()),
})

export function OrderDataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_KEY}/customers`)
      .then((data) => {
        return data.json()
      })
      .then((customers) => {
        setCustomers(customers.customers)
      })
    fetch(`${process.env.NEXT_PUBLIC_API_KEY}/products`)
      .then((data) => {
        return data.json()
      })
      .then((products) => {
        setProducts(products.products)
      })
  }, [])
  const [rowSelection, setRowSelection] = useState({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [products, setProducts] = useState<ProductsArray[]>([])
  const form = useForm<CreatingOrderFormValues>()
  const onSubmit = async (newOrder: CreatingOrderFormValues) => {
    const orderItems = newOrder.orderItems.map((item) => ({
      productName: item.productName,
      quantity: parseInt(item.quantity),
    }))
    console.log(newOrder)
    const body = {
      customerName: newOrder.customer,
      orderItems,
    }
    try {
      fetch(`${process.env.NEXT_PUBLIC_API_KEY}/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }).then((response) => {
        if (response.status === 201) {
          toast({
            className: 'bg-green-700',
            title: 'Cadastro realizado com sucesso!',
          })
          action('orders')
          form.reset()
        } else {
          throw new Error()
        }
        return response.json()
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro no cadastro!',
        description:
          'Não foi possível cadastrar o Cliente, verifique as credenciais',
      })
      form.reset()
      console.error(error)
    }
  }
  const table = useReactTable({
    data,
    columns,
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  })

  return (
    <div className="mx-4">
      <div className="flex items-center justify-center gap-2">
        <div className="flex items-center py-4">
          <Input
            placeholder="Filtrar por id..."
            value={(table.getColumn('id')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('id')?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
        <div className="flex items-center py-4">
          <Input
            placeholder="Filtrar por Pedido..."
            value={
              (table.getColumn('customer')?.getFilterValue() as string) ?? ''
            }
            onChange={(event) =>
              table.getColumn('customer')?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-1">
              <PlusCircle className="w-4 h-4" />
              Novo Pedido
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Pedido</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center">
                    <FormField
                      control={form.control}
                      name="customer"
                      render={({ field }) => (
                        <FormItem className="flex flex-col w-full">
                          <div className="flex items-center gap-10">
                            <FormLabel>Cliente</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn(
                                      'w-[400px] justify-between',
                                      !field.value && 'text-muted-foreground',
                                    )}
                                  >
                                    {field.value
                                      ? customers.find(
                                          (customer) =>
                                            customer?.name === field.value,
                                        )?.name
                                      : 'Selecione um Cliente'}
                                    <Store className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-[200px] p-0">
                                <Command>
                                  <CommandInput placeholder="Procure um Cliente..." />
                                  <CommandEmpty>
                                    Nenhum Cliente encontrado.
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {customers.map((customer) => (
                                      <CommandItem
                                        value={customer?.name}
                                        key={customer.id}
                                        onSelect={() => {
                                          form.setValue(
                                            'customer',
                                            customer?.name,
                                          )
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            'mr-2 h-4 w-4',
                                            customer?.name === field.value
                                              ? 'opacity-100'
                                              : 'opacity-0',
                                          )}
                                        />
                                        {customer?.name}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </Command>
                              </PopoverContent>
                            </Popover>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center">
                    <FormField
                      control={form.control}
                      name="orderItems.0.productName"
                      render={({ field }) => (
                        <FormItem className="flex flex-col w-full">
                          <div className="flex items-center gap-10">
                            <FormLabel>Produto</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn(
                                      'w-[400px] justify-between',
                                      !field.value && 'text-muted-foreground',
                                    )}
                                  >
                                    {field.value
                                      ? products.find(
                                          (product) =>
                                            product.name === field.value,
                                        )?.name
                                      : 'Selecione um Produto'}
                                    <Store className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-[200px] p-0">
                                <Command>
                                  <CommandInput placeholder="Procure um Produto..." />
                                  <CommandEmpty>
                                    Nenhum Produto encontrado.
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {products.map(
                                      (
                                        product,
                                        // TODO add index
                                      ) => (
                                        <CommandItem
                                          value={product?.name}
                                          key={product.id}
                                          onSelect={() => {
                                            form.setValue(
                                              `orderItems.0.productName`,
                                              product?.name,
                                            )
                                          }}
                                        >
                                          <Check
                                            className={cn(
                                              'mr-2 h-4 w-4',
                                              product?.name === field.value
                                                ? 'opacity-100'
                                                : 'opacity-0',
                                            )}
                                          />
                                          {product?.name}
                                        </CommandItem>
                                      ),
                                    )}
                                  </CommandGroup>
                                </Command>
                              </PopoverContent>
                            </Popover>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="quantity">Quantidade</Label>
                    <Input
                      id="quantity"
                      placeholder="Quantidade"
                      className="col-span-3"
                      {...form.register('orderItems.0.quantity')}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Cadastrar Pedido</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="rounded-md border">
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
      <div className="flex justfy-center items-center">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} de{' '}
          {table.getFilteredRowModel().rows.length} linhas(s) selecionadas.
        </div>
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
  )
}
