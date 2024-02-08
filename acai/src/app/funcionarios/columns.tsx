'use client'

import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
                await fetch(
                  `${process.env.NEXT_PUBLIC_API_KEY}/user/${user.id}`,
                  {
                    method: 'DELETE',
                    next: {
                      revalidate: 1,
                      tags: ['users'],
                    },
                  },
                )
                action('users')
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
