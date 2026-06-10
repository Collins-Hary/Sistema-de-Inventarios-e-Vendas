'use client'

import { CheckCircle, AlertCircle, XCircle } from 'lucide-react'
import { useState, useEffect } from 'react'

interface ToastProps {
  mensagem: string
  tipo?: 'sucesso' | 'erro' | 'info'
  duracao?: number
}

export default function Toast({ mensagem, tipo = 'info', duracao = 3000 }: ToastProps) {
  const [visivel, setVisivel] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setVisivel(false), duracao)
    return () => clearTimeout(timer)
  }, [duracao])

  if (!visivel) return null

  const cores = {
    sucesso: 'bg-green-100 text-green-800 border-green-300',
    erro: 'bg-red-100 text-red-800 border-red-300',
    info: 'bg-blue-100 text-blue-800 border-blue-300',
  }

  const Icone = {
    sucesso: CheckCircle,
    erro: XCircle,
    info: AlertCircle,
  }[tipo]

  return (
    <div className={`fixed bottom-4 right-4 border rounded-lg p-4 flex items-center gap-2 ${cores[tipo]}`}>
      <Icone size={20} />
      <span>{mensagem}</span>
    </div>
  )
}
