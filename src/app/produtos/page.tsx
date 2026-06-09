'use client'

import { useEffect, useMemo, useState, type FormEvent } from 'react'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import Button from '@/components/Button'
import Input from '@/components/Input'
import FormProduto from '@/components/FormProduto'
import LoadingSpinner from '@/components/LoadingSpinner'

interface Categoria {
  id: number
  nome: string
}

interface Produto {
  id: number
  nome: string
  descricao: string | null
  preco: number
  custo: number
  quantidade: number
  quantidadeMinima: number
  ativo: boolean
  categoria: Categoria
}

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [buscaNome, setBuscaNome] = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState('')
  const [modalAberto, setModalAberto] = useState(false)
  const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [categoriaModalAberto, setCategoriaModalAberto] = useState(false)
  const [categoriaNome, setCategoriaNome] = useState('')
  const [categoriaDescricao, setCategoriaDescricao] = useState('')
  const [categoriaErro, setCategoriaErro] = useState('')
  const [categoriaSucesso, setCategoriaSucesso] = useState('')

  const buscarDados = async () => {
    setCarregando(true)
    setErro('')

    try {
      const [produtosResponse, categoriasResponse] = await Promise.all([
        fetch('/api/produtos'),
        fetch('/api/categorias'),
      ])

      if (!produtosResponse.ok || !categoriasResponse.ok) {
        throw new Error('Erro ao buscar dados.')
      }

      const produtosData = await produtosResponse.json()
      const categoriasData = await categoriasResponse.json()

      setProdutos(produtosData)
      setCategorias(categoriasData)
    } catch (error: any) {
      setErro(error.message || 'Não foi possível carregar os produtos.')
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    buscarDados()
  }, [])

  const produtosFiltrados = useMemo(() => {
    return produtos.filter((produto) => {
      const matchesNome = produto.nome.toLowerCase().includes(buscaNome.toLowerCase())
      const matchesCategoria = filtroCategoria ? produto.categoria.id === Number(filtroCategoria) : true
      return matchesNome && matchesCategoria
    })
  }, [produtos, buscaNome, filtroCategoria])

  const abrirModalCriar = () => {
    setProdutoEditando(null)
    setModalAberto(true)
  }

  const abrirModalEditar = (produto: Produto) => {
    setProdutoEditando(produto)
    setModalAberto(true)
  }

  const fecharModal = () => {
    setModalAberto(false)
    setProdutoEditando(null)
  }

  const semCategorias = categorias.length === 0

  const handleSalvar = () => {
    fecharModal()
    setSucesso('Produto salvo com sucesso.')
    buscarDados()
  }

  const abrirModalCriarCategoria = () => {
    setCategoriaErro('')
    setCategoriaSucesso('')
    setCategoriaNome('')
    setCategoriaDescricao('')
    setCategoriaModalAberto(true)
  }

  const fecharModalCategoria = () => {
    setCategoriaModalAberto(false)
    setCategoriaErro('')
    setCategoriaSucesso('')
  }

  const handleSalvarCategoria = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setCategoriaErro('')
    setCategoriaSucesso('')

    if (!categoriaNome.trim()) {
      setCategoriaErro('Nome da categoria é obrigatório.')
      return
    }

    setCarregando(true)

    try {
      const response = await fetch('/api/categorias', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: categoriaNome.trim(),
          descricao: categoriaDescricao.trim() || null,
        }),
      })

      const body = await response.json()
      if (!response.ok) {
        throw new Error(body.erro || 'Erro ao criar categoria.')
      }

      setCategorias((prev) => [body, ...prev])
      setCategoriaSucesso('Categoria criada com sucesso.')
      setSucesso('Categoria criada com sucesso.')
      fecharModalCategoria()
    } catch (error: any) {
      setCategoriaErro(error.message || 'Não foi possível criar a categoria.')
    } finally {
      setCarregando(false)
    }
  }

  const handleExcluir = async (produto: Produto) => {
    const confirmado = window.confirm(`Deseja realmente excluir ${produto.nome}?`)
    if (!confirmado) return

    try {
      const response = await fetch(`/api/produtos/${produto.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const body = await response.json()
        throw new Error(body.erro || 'Erro ao excluir produto.')
      }

      setProdutos((prev) => prev.filter((item) => item.id !== produto.id))
      setSucesso(`Produto "${produto.nome}" excluído com sucesso.`)
    } catch (error: any) {
      alert(error.message || 'Não foi possível excluir o produto.')
    }
  }

  return (
    <div>
      <Navbar />
      <div className="lg:flex gap-6 max-w-7xl mx-auto px-4 py-8">
        <Sidebar />

        <main className="flex-1 space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold">📦 Produtos</h1>
              <p className="text-gray-600 mt-1">Gerencie produtos, categorias e estoque.</p>
                {semCategorias && (
                  <p className="mt-2 text-sm text-yellow-700">
                    Cadastre uma categoria antes de adicionar produtos.
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-3 items-center">
                <Button onClick={abrirModalCriar} disabled={semCategorias}>
                  + Novo Produto
                </Button>
                <Button type="button" variant="secondary" onClick={abrirModalCriarCategoria}>
                  + Nova Categoria
                </Button>
              </div>
              <Input
                value={buscaNome}
                onChange={(event) => setBuscaNome(event.target.value)}
                placeholder="Buscar por nome"
                className="md:col-span-2"
              />
            <div>
              <label className="sr-only">Filtrar por categoria</label>
              <select
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                value={filtroCategoria}
                onChange={(event) => setFiltroCategoria(event.target.value)}
              >
                <option value="">Todas as categorias</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {sucesso && (
            <div className="rounded-xl bg-emerald-50 p-4 text-emerald-700 border border-emerald-200">
              {sucesso}
            </div>
          )}

          {carregando ? (
            <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-200">
              <LoadingSpinner />
            </div>
          ) : erro ? (
            <div className="rounded-xl bg-red-50 p-6 text-red-700 border border-red-200">
              {erro}
            </div>
          ) : (
            <div className="rounded-xl bg-white shadow-sm border border-gray-200 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Nome</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Categoria</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Preço</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Custo</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Estoque</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Mínimo</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {produtosFiltrados.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-6 text-center text-gray-500">
                        Nenhum produto encontrado.
                      </td>
                    </tr>
                  ) : (
                    produtosFiltrados.map((produto) => {
                      const estoqueBaixo = produto.quantidade < produto.quantidadeMinima
                      return (
                        <tr
                          key={produto.id}
                          className={estoqueBaixo ? 'bg-red-50' : ''}
                        >
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {produto.nome}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                            {produto.categoria.nome}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                            Kz{produto.preco.toFixed(2)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                            Kz{produto.custo.toFixed(2)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                            {produto.quantidade}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                            {produto.quantidadeMinima}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                                estoqueBaixo
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-green-100 text-green-700'
                              }`}
                            >
                              {estoqueBaixo ? 'Stock baixo' : 'Estável'}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-center space-x-2">
                            <Button
                              type="button"
                              variant="secondary"
                              className="px-3 py-1 text-sm"
                              onClick={() => abrirModalEditar(produto)}
                            >
                              Editar
                            </Button>
                            <Button
                              type="button"
                              variant="danger"
                              className="px-3 py-1 text-sm"
                              onClick={() => handleExcluir(produto)}
                            >
                              Excluir
                            </Button>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-full w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold">
                  {produtoEditando ? 'Editar Produto' : 'Novo Produto'}
                </h2>
                <p className="text-sm text-gray-500">Preencha os dados do produto para salvar.</p>
              </div>
              <button
                type="button"
                onClick={fecharModal}
                className="rounded-full border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Fechar
              </button>
            </div>

            <FormProduto
              categories={categorias}
              produto={produtoEditando ? {
                id: produtoEditando.id,
                nome: produtoEditando.nome,
                descricao: produtoEditando.descricao ?? '',
                preco: produtoEditando.preco.toString(),
                custo: produtoEditando.custo.toString(),
                quantidade: produtoEditando.quantidade.toString(),
                quantidadeMinima: produtoEditando.quantidadeMinima.toString(),
                categoriaId: produtoEditando.categoria.id.toString(),
                ativo: produtoEditando.ativo,
              } : undefined}
              onCancel={fecharModal}
              onSaved={handleSalvar}
            />
          </div>
        </div>
      )}

      {categoriaModalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-full w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold">Nova Categoria</h2>
                <p className="text-sm text-gray-500">Cadastre uma categoria para poder selecionar ao criar produtos.</p>
              </div>
              <button
                type="button"
                onClick={fecharModalCategoria}
                className="rounded-full border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Fechar
              </button>
            </div>

            <form onSubmit={handleSalvarCategoria} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome da categoria</label>
                <Input
                  value={categoriaNome}
                  onChange={(event) => setCategoriaNome(event.target.value)}
                  placeholder="Nome da categoria"
                  disabled={carregando}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                <textarea
                  value={categoriaDescricao}
                  onChange={(event) => setCategoriaDescricao(event.target.value)}
                  rows={3}
                  disabled={carregando}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                  placeholder="Descrição opcional"
                />
              </div>

              {categoriaErro && <p className="text-red-600 text-sm">{categoriaErro}</p>}
              {categoriaSucesso && <p className="text-emerald-700 text-sm">{categoriaSucesso}</p>}

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button type="button" variant="secondary" className="w-full sm:w-auto" onClick={fecharModalCategoria}>
                  Cancelar
                </Button>
                <Button type="submit" className="w-full sm:w-auto" disabled={carregando}>
                  {carregando ? 'Salvando...' : 'Criar categoria'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
