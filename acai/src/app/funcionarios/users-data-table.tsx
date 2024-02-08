'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Check, PlusCircle, Store } from 'lucide-react'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
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

interface GroupAPI {
  groupName: string
  levelOfAccess: number
  groupId: string
}
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}
const usersFormSchema = z.object({
  username: z.string({ required_error: 'Nome obrigatório' }).min(2, {
    message: 'Nome do usuário deve ter pelo menos 2 caracteres',
  }),

  password: z.string(),
  groups: z.string().min(2, {
    message: 'Grupo deve conter pelo menos 2 caracteres',
  }),
})
type UserFormValues = z.infer<typeof usersFormSchema>

export function UsersDataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [groups, setGroups] = useState<GroupAPI[]>([])

  const form = useForm<UserFormValues>({
    resolver: zodResolver(usersFormSchema),
  })
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_KEY}/groups`)
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        setGroups(data)
      })
  }, [])

  const onSubmit: SubmitHandler<UserFormValues> = async (newUser) => {
    const body = {
      username: newUser.username,
      password: newUser.password,
      group: [newUser.groups],
    }

    try {
      const userApiResposne = await fetch(
        `${process.env.NEXT_PUBLIC_API_KEY}/user`,
        {
          body: JSON.stringify(body),
          method: 'POST',
          next: {
            revalidate: 1,
            tags: ['users'],
          },
        },
      )
      if (userApiResposne.ok) {
        action('users')
        form.reset()
      }
    } catch (error) {}
    toast({
      title: 'Cadastro',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-green-700">
            Funcionário cadastrado com sucesso!
          </code>
        </pre>
      ),
    })
  }
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  })
  return (
    <div>
      <div className="flex gap-4 justify-center items-center">
        <div className="flex items-center py-4">
          <Input
            placeholder="Filtrar por ids..."
            value={(table.getColumn('id')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('id')?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
        <div className="flex items-center py-4">
          <Input
            placeholder="Filtrar por nome..."
            value={
              (table.getColumn('username')?.getFilterValue() as string) ?? ''
            }
            onChange={(event) =>
              table.getColumn('username')?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-1">
                <PlusCircle className="w-4 h-4" />
                Novo Funcionario
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Funcionario</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="flex flex-col items-center gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="name"
                        placeholder="nome do funcionario"
                        className="col-span-3"
                        {...form.register('username')}
                      />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="group" className="text-right">
                        Senha
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Senha do usuario"
                        className="col-span-3"
                        {...form.register('password')}
                      />
                    </div>

                    <div className="ml-14 mb-2 grid grid-cols-4 items-center gap-4">
                      <FormField
                        control={form.control}
                        name="groups"
                        render={({ field }) => (
                          <FormItem className="flex flex-col w-full">
                            <div className="flex items-center gap-4 ">
                              <FormLabel>Grupo</FormLabel>
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
                                        ? groups.find(
                                            (group) =>
                                              group.groupName === field.value,
                                          )?.groupName
                                        : 'Selecione um Grupo'}
                                      <Store className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-[200px] p-0">
                                  <Command>
                                    <CommandInput placeholder="Procure um grupo..." />
                                    <CommandEmpty>
                                      Nenhum Grupo encontrado.
                                    </CommandEmpty>
                                    <CommandGroup>
                                      {groups.map((group) => (
                                        <CommandItem
                                          value={group.groupName}
                                          key={group.groupId}
                                          onSelect={() => {
                                            form.setValue(
                                              'groups',
                                              group.groupName,
                                            )
                                          }}
                                        >
                                          <Check
                                            className={cn(
                                              'mr-2 h-4 w-4',
                                              group.groupName === field.value
                                                ? 'opacity-100'
                                                : 'opacity-0',
                                            )}
                                          />
                                          {group.groupName}
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
                  </div>
                  <DialogFooter>
                    <Button type="submit">Cadastrar Funcionario</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
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
  )
}