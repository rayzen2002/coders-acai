'use client'

import { ColumnDef } from '@tanstack/react-table'
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
import { toast } from '@/components/ui/use-toast'
import action from '@/lib/api/actions'
export interface Functionary {
  id: string
  username: string
  groups: {
    groupName: string
    levelOfAccess: number
  }[]
}

export const columns: ColumnDef<Functionary>[] = [
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
    accessorKey: 'username',
    header: 'Nome',
  },
  {
    accessorKey: 'groupName',
    header: 'Grupos',
    cell: ({ row }) => {
      const groups = row.original
      return (
        <div>
          {groups?.groups.map((group) => {
            return group.groupName
          })}
        </div>
      )
    },
  },
  {
    accessorKey: 'levelOfAccess',
    header: 'Nivel de acesso',
    cell: ({ row }) => {
      const groups = row.original
      return (
        <div>
          {groups.groups.map((group) => {
            return group.levelOfAccess
          })}
        </div>
      )
    },
  },

  {
    id: 'actions',
    cell: ({ row }) => {
      const user = row.original

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
              onClick={() => navigator.clipboard.writeText(user.id)}
            >
              Copiar ID do funcionário
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
            <DropdownMenuItem
              onClick={async () => {
                try {
                  const userResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_API_KEY}/user/${user.id}`,
                    {
                      method: 'DELETE',
                      next: {
                        revalidate: 1,
                        tags: ['users'],
                      },
                    },
                  )
                  if (userResponse.ok) {
                    toast({
                      variant: 'default',
                      title: 'Cliente deletado com sucesso!',
                      description: `O Cliente ${row.getValue('username')} foi deletado`,
                    })
                    action('users')
                  } else {
                    throw new Error()
                  }
                } catch (error) {
                  toast({
                    variant: 'destructive',
                    title: 'Erro ao deletar Funcionário!',
                    description: `O Funcionário ${row.getValue('username')} não foi deletado`,
                  })
                  console.error(error)
                }
              }}
              className="text-red-600"
            >
              Deletar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
