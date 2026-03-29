'use client'

import Link from 'next/link'
import { Menu } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const [menuAberto, setMenuAberto] = useState(false)

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          📦 Inventário
        </Link>

        <button
          onClick={() => setMenuAberto(!menuAberto)}
          className="md:hidden p-2 hover:bg-blue-700 rounded"
        >
          <Menu size={24} />
        </button>

        <div className={`${menuAberto ? 'block' : 'hidden'} md:block md:flex gap-6`}>
          <Link href="/dashboard" className="hover:bg-blue-700 px-3 py-2 rounded">
            Dashboard
          </Link>
          <Link href="/produtos" className="hover:bg-blue-700 px-3 py-2 rounded">
            Produtos
          </Link>
          <Link href="/vendas" className="hover:bg-blue-700 px-3 py-2 rounded">
            Vendas
          </Link>
        </div>
      </div>
    </nav>
  )
}
