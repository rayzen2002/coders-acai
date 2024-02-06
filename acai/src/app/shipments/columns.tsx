'use client'

import { ColumnDef } from '@tanstack/react-table'
export type Shipments = {
  id: string
  description: string
}
export const column: ColumnDef<Shipments>[] = [
  {
    accessorKey: 'id',
    header: 'id',
  },
  {
    accessorKey: 'description',
    header: 'description',
  },
]
