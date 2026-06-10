'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle } from 'lucide-react'

export default function LowStockBadge() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    fetch('/api/produtos')
      .then(res => res.json())
      .then(data => {
        const lowStock = data.filter((p: any) => p.quantidade < p.quantidadeMinima)
        setCount(lowStock.length)
      })
  }, [])

  if (count === 0) return null

  return (
    <span className="inline-flex items-center justify-center bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-1 animate-pulse">
      {count}
    </span>
  )
}