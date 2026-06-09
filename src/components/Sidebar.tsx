'use client'

import Link from 'next/link'
import { Box, ShoppingCart, LayoutGrid, ChevronRight } from 'lucide-react'

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { href: '/produtos', label: 'Produtos', icon: Box },
  { href: '/vendas', label: 'Vendas', icon: ShoppingCart },
]

export default function Sidebar() {
  return (
    <aside className="hidden lg:block w-72 h-[calc(100vh-4rem)] sticky top-16 bg-white border-r border-gray-200 p-6">
      <div className="mb-8">
        <span className="text-sm uppercase tracking-[0.24em] text-gray-500">Navegação</span>
      </div>

      <nav className="space-y-2">
        {links.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center justify-between rounded-lg border border-transparent px-4 py-3 text-gray-700 hover:bg-blue-50 hover:border-blue-200"
            >
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5 text-blue-600" />
                <span className="font-medium">{item.label}</span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
