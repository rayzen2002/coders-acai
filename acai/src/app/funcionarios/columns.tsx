'use client'

import { ColumnDef } from '@tanstack/react-table'

export type Functionary = {
  username: string
  groupName: string
  levelOfAccess: number
}

export const columns: ColumnDef<Functionary>[] = [
  {
    accessorKey: 'username',
    header: 'username',
  },
  {
    accessorKey: 'groupName',
    header: 'groupName',
  },
  {
    accessorKey: 'levelOfAccess',
    header: 'levelOfAccess',
  },
]
