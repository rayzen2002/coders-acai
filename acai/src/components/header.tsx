import {
  Barcode,
  Cherry,
  Home,
  SquareUserRound,
  Truck,
  Users,
  UtensilsCrossed,
} from 'lucide-react'
import Link from 'next/link'

import { ModeToggle } from './theme/mode-toggle'
import { Separator } from './ui/separator'

export function Header() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center gap-6 px-6">
        <Cherry className="h-6 w-6" />

        <Separator orientation="vertical" className="h-6" />

        <nav className="flex items-center space-x-4 lg:space-x-6">
          <Link
            href="/dashboard"
            className="flex items-center space-x-4 lg:space-x-6"
          >
            <Home className="h-4 w-4" />
            Início
          </Link>
          <Link
            href="/pedidos"
            className="flex items-center space-x-4 lg:space-x-6"
          >
            <UtensilsCrossed className="h-4 w-4" />
            Pedidos
          </Link>
          <Link
            href="/clientes"
            className="flex items-center space-x-4 lg:space-x-6"
          >
            <Users className="h-4 w-4" />
            Clientes
          </Link>
          <Link
            href="/carregamentos"
            className="flex items-center space-x-4 lg:space-x-6"
          >
            <Truck className="h-4 w-4" />
            Carregamentos
          </Link>
          <Link
            href="/produtos"
            className="flex items-center space-x-4 lg:space-x-6"
          >
            <Barcode className="h-4 w-4" />
            Produtos
          </Link>
          <Link
            href="/funcionarios"
            className="flex items-center space-x-4 lg:space-x-6"
          >
            <SquareUserRound className="h-4 w-4" />
            Funcionarios
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ModeToggle />
        </div>
      </div>
    </div>
  )
}
