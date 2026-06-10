'use client'

import { useMemo, useState } from 'react'
import Button from './Button'
import Input from './Input'

interface ProdutoParaVenda {
  id: number
  nome: string
  preco: number
  custo: number
  quantidadeMinima: number // Adicionado para consistência
}

interface Utilizador {
  id: number
  nome: string
}

interface VendaItemForm {
  produtoId: string
  quantidade: string
}

interface FormVendaProps {
  produtos: ProdutoParaVenda[]
  onCancel: () => void
  utilizadores: Utilizador[] // Adicionado para seleção de utilizador
  onSaved: () => void
}

export default function FormVenda({ produtos, utilizadores, onCancel, onSaved }: FormVendaProps) {
  const [utilizadorId, setUtilizadorId] = useState(utilizadores?.[0]?.id?.toString() || '')
  const [observacoes, setObservacoes] = useState('')
  const [itensVenda, setItensVenda] = useState<VendaItemForm[]>([
    { produtoId: produtos[0]?.id?.toString() || '', quantidade: '1' },
  ])
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  const produtosPorId = useMemo(
    () => new Map(produtos.map((produto) => [produto.id.toString(), produto])),
    [produtos]
  )

  const resumo = useMemo(() => {
    return itensVenda.reduce(
      (acc, item) => {
        const produto = produtosPorId.get(item.produtoId)
        if (!produto) {
          return acc
        }

        const quantidade = Number(item.quantidade) || 0
        const subtotal = produto.preco * quantidade
        const lucroUnitario = produto.preco - produto.custo

        acc.total += subtotal
        acc.lucro += lucroUnitario * quantidade
        return acc
      },
      { total: 0, lucro: 0 }
    )
  }, [itensVenda, produtosPorId])

  const adicionarItem = () => {
    setItensVenda((prev) => [...prev, { produtoId: produtos[0]?.id?.toString() || '', quantidade: '1' }])
  }

  const removerItem = (index: number) => {
    setItensVenda((prev) => prev.filter((_, itemIndex) => itemIndex !== index))
  }

  const atualizarItem = (index: number, field: keyof VendaItemForm, value: string) => {
    setItensVenda((prev) =>
      prev.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      )
    )
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setErro('')

    if (!utilizadorId.trim()) {
      setErro('ID do utilizador é obrigatório.')
      return
    }

    if (itensVenda.length === 0) {
      setErro('Adicione pelo menos um item à venda.')
      return
    }

    const itensValidos = itensVenda.map((item) => ({
      produtoId: Number(item.produtoId),
      quantidade: Number(item.quantidade),
    }))

    if (itensValidos.some((item) => !item.produtoId || item.quantidade <= 0)) {
      setErro('Cada item deve ter produto válido e quantidade maior que zero.')
      return
    }

    setCarregando(true)

    try {
      const response = await fetch('/api/vendas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          utilizadorId: Number(utilizadorId),
          observacoes: observacoes.trim(),
          itensVenda: itensValidos,
        }),
      })

      if (!response.ok) {
        const body = await response.json()
        throw new Error(body.erro || 'Erro ao registrar venda.')
      }

      onSaved()
    } catch (error: any) {
      setErro(error.message || 'Não foi possível registrar a venda.')
    } finally {
      setCarregando(false)
    }
  }

  if (produtos.length === 0) {
    return (
      <div className="rounded-3xl border border-gray-200 bg-yellow-50 p-6 text-yellow-700">
        Nenhum produto disponível. Cadastre produtos antes de registrar uma venda.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Utilizador</label>
          <select
            value={utilizadorId}
            onChange={(event) => setUtilizadorId(event.target.value)}
            disabled={carregando}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="">Selecione um utilizador</option>
            {utilizadores.map((utilizador) => (
              <option key={utilizador.id} value={utilizador.id}>
                {utilizador.nome}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Observações</label>
          <textarea
            value={observacoes}
            onChange={(event) => setObservacoes(event.target.value)}
            rows={3}
            disabled={carregando}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
            placeholder="Comentários ou informações adicionais"
          />
        </div>
      </div>

      <div className="space-y-4">
        {itensVenda.map((item, index) => (
          <div key={`${item.produtoId}-${index}`} className="grid gap-4 md:grid-cols-12 items-end rounded-3xl border border-gray-200 bg-gray-50 p-4">
            <div className="md:col-span-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">Produto</label>
              <select
                value={item.produtoId}
                onChange={(event) => atualizarItem(index, 'produtoId', event.target.value)}
                disabled={carregando}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="">Selecione um produto</option>
                {produtos.map((produto) => (
                  <option key={produto.id} value={produto.id}>
                    {produto.nome} - Kz{produto.preco.toFixed(2)}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantidade</label>
              <Input
                type="number"
                min="1"
                step="1"
                value={item.quantidade}
                onChange={(event) => atualizarItem(index, 'quantidade', event.target.value)}
                placeholder="1"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">Subtotal</label>
              <div className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900">
                Kz{((produtosPorId.get(item.produtoId)?.preco ?? 0) * Number(item.quantidade)).toFixed(2)}
              </div>
            </div>

            <div className="md:col-span-1 flex items-center justify-end">
              <button
                type="button"
                onClick={() => removerItem(index)}
                className="rounded-full bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
              >
                Remover
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 rounded-3xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-500">Total estimado</p>
          <p className="text-2xl font-semibold text-gray-900">Kz{resumo.total.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Lucro estimado</p>
          <p className="text-2xl font-semibold text-green-700">Kz{resumo.lucro.toFixed(2)}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <Button type="button" variant="secondary" className="w-full sm:w-auto" onClick={adicionarItem}>
          + Adicionar produto
        </Button>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button type="button" variant="secondary" className="w-full sm:w-auto" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" className="w-full sm:w-auto" disabled={carregando}>
            {carregando ? 'Confirmando...' : 'Confirmar venda'}
          </Button>
        </div>
      </div>

      {erro && <p className="text-red-600 text-sm">{erro}</p>}
    </form>
  )
}
