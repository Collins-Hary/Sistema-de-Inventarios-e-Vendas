'use client'

import { useEffect, useState } from 'react'
import Button from './Button'
import Input from './Input'

interface Categoria {
  id: number
  nome: string
}

interface ProdutoFormData {
  id?: number
  nome: string
  descricao: string
  preco: string
  custo: string
  quantidade: string
  quantidadeMinima: string
  categoriaId: string
  ativo: boolean
}

interface FormProdutoProps {
  categories: Categoria[]
  produto?: ProdutoFormData
  onCancel: () => void
  onSaved: () => void
}

export default function FormProduto({ categories, produto, onCancel, onSaved }: FormProdutoProps) {
  const [formData, setFormData] = useState<ProdutoFormData>(
    produto || {
      nome: '',
      descricao: '',
      preco: '',
      custo: '',
      quantidade: '0',
      quantidadeMinima: '0',
      categoriaId: categories[0]?.id?.toString() || '',
      ativo: true,
    }
  )
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => {
    if (produto) {
      setFormData(produto)
      return
    }

    if (!formData.categoriaId && categories.length > 0) {
      setFormData((prev) => ({ ...prev, categoriaId: categories[0].id.toString() }))
    }
  }, [categories, produto])

  const handleChange = (field: keyof ProdutoFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const semCategorias = categories.length === 0

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setErro('')

    if (semCategorias) {
      setErro('Cadastre pelo menos uma categoria antes de criar um produto.')
      return
    }

    if (!formData.nome.trim()) {
      setErro('Nome do produto é obrigatório.')
      return
    }

    if (!formData.categoriaId) {
      setErro('Categoria é obrigatória.')
      return
    }

    const payload = {
      nome: formData.nome.trim(),
      descricao: formData.descricao.trim(),
      preco: Number(formData.preco),
      custo: Number(formData.custo),
      quantidade: Number(formData.quantidade),
      quantidadeMinima: Number(formData.quantidadeMinima),
      categoriaId: Number(formData.categoriaId),
      ativo: formData.ativo,
    }

    if (Number.isNaN(payload.preco) || Number.isNaN(payload.custo)) {
      setErro('Preço e custo devem ser números válidos.')
      return
    }

    if (Number.isNaN(payload.quantidade) || Number.isNaN(payload.quantidadeMinima)) {
      setErro('Quantidade e quantidade mínima devem ser números válidos.')
      return
    }

    setLoading(true)

    try {
      const url = produto?.id ? `/api/produtos/${produto.id}` : '/api/produtos'
      const method = produto?.id ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const body = await response.json()
        throw new Error(body.erro || 'Erro ao salvar produto.')
      }

      onSaved()
    } catch (error: any) {
      setErro(error.message || 'Não foi possível salvar o produto.')
    } finally {
      setLoading(false)
    }
  }

  return (
    semCategorias ? (
      <div className="rounded-3xl border border-yellow-200 bg-yellow-50 p-6 text-yellow-700">
        <p className="mb-3 font-semibold">Nenhuma categoria disponível</p>
        <p>Cadastre uma categoria antes de adicionar um novo produto.</p>
      </div>
    ) : (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
          <Input
            value={formData.nome}
            onChange={(event) => handleChange('nome', event.target.value)}
            placeholder="Nome do produto"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
          <select
            value={formData.categoriaId}
            onChange={(event) => handleChange('categoriaId', event.target.value)}
            disabled={loading}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="">Selecione uma categoria</option>
            {categories.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nome}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Preço</label>
          <Input
            type="number"
            step="0.01"
            value={formData.preco}
            onChange={(event) => handleChange('preco', event.target.value)}
            placeholder="0.00"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Custo</label>
          <Input
            type="number"
            step="0.01"
            value={formData.custo}
            onChange={(event) => handleChange('custo', event.target.value)}
            placeholder="0.00"
            disabled={loading}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Quantidade</label>
          <Input
            type="number"
            value={formData.quantidade}
            onChange={(event) => handleChange('quantidade', event.target.value)}
            placeholder="0"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Quantidade mínima</label>
          <Input
            type="number"
            value={formData.quantidadeMinima}
            onChange={(event) => handleChange('quantidadeMinima', event.target.value)}
            placeholder="0"
            disabled={loading}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
        <textarea
          value={formData.descricao}
          onChange={(event) => handleChange('descricao', event.target.value)}
          rows={3}
          disabled={loading}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
          placeholder="Descrição opcional"
        />
      </div>

      <div className="flex items-center gap-4">
        <label className="inline-flex items-center gap-2 text-gray-700">
          <input
            type="checkbox"
            checked={formData.ativo}
            onChange={(event) => handleChange('ativo', event.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          Ativo
        </label>
      </div>

      {erro && <p className="text-red-600 text-sm">{erro}</p>}

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="secondary" className="w-full sm:w-auto" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" className="w-full sm:w-auto" disabled={loading}>
          {loading ? 'Salvando...' : produto ? 'Atualizar produto' : 'Criar produto'}
        </Button>
      </div>
    </form>
  )
  )
}
