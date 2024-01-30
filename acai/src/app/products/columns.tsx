import { faker } from '@faker-js/faker'
import { ColumnDef } from '@tanstack/react-table'

export type Products = {
  id: string
  name: string
  status: string
  weight: number
  stock: number
}

export const columns: ColumnDef<Products>[] = [
  {
    accessorKey: 'id',
    header: 'id',
  },
  {
    accessorKey: 'name',
    header: 'name',
  },
  {
    accessorKey: 'status',
    header: 'status',
  },
  {
    accessorKey: 'weight',
    header: () => <div>Peso</div>,
    cell: ({ row }) => {
      const weight: number = row.getValue('weight')
      const formated = `${weight} Kg`
      return <div>{formated}</div>
    },
  },
  {
    accessorKey: 'stock',
    header: 'stock',
  },
]
