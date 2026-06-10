'use client'

import { useEffect, useMemo, useState } from 'react'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import Button from '@/components/Button'
import { FileSpreadsheet } from 'lucide-react'
import Input from '@/components/Input'
import LoadingSpinner from '@/components/LoadingSpinner'
import FormVenda from '@/components/FormVenda'

interface Utilizador {
  id: number
  nome: string
}

interface ItemVenda {
  produtoId: number
  quantidade: number
  precoUnitario: number
  lucroUnitario: number
  subtotal: number
  produto: {
    id: number
    nome: string
  }
}

interface Venda {
  id: number
  dataVenda: string
  total: number
  lucroTotal: number
  observacoes: string | null
  utilizador: Utilizador
  itensVenda: ItemVenda[]
}

interface ProdutoParaVenda {
  id: number
  nome: string
  preco: number
  custo: number
  quantidadeMinima: number // Adicionado para consistência
  quantidade: number
}

export default function VendasPage() {
  const [vendas, setVendas] = useState<Venda[]>([])
  const [produtos, setProdutos] = useState<ProdutoParaVenda[]>([])
  const [buscaUsuario, setBuscaUsuario] = useState('')
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim] = useState('')
  const [abrirModal, setAbrirModal] = useState(false)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [utilizadores, setUtilizadores] = useState<Utilizador[]>([])
  const [sucesso, setSucesso] = useState('')

  const buscarDados = async () => {
    setCarregando(true)
    setErro('')

    try {
      const [vendasResponse, utilizadoresResponse, produtosResponse] = await Promise.all([
        fetch('/api/vendas'),
        fetch('/api/utilizadores'), // Buscar utilizadores
        fetch('/api/produtos'),
      ])

      if (!vendasResponse.ok || !utilizadoresResponse.ok || !produtosResponse.ok) {
        const vendasError = vendasResponse.ok ? '' : `Erro vendas: ${vendasResponse.status} ${vendasResponse.statusText}. `
        const utilizadoresError = utilizadoresResponse.ok ? '' : `Erro utilizadores: ${utilizadoresResponse.status} ${utilizadoresResponse.statusText}. `
        const produtosError = produtosResponse.ok ? '' : `Erro produtos: ${produtosResponse.status} ${produtosResponse.statusText}. `
        throw new Error(`Erro ao buscar dados: ${vendasError}${utilizadoresError}${produtosError}Verifique o console para mais detalhes.`)
      }

      const vendasData = await vendasResponse.json()
      const produtosData = await produtosResponse.json()
      const utilizadoresData = await utilizadoresResponse.json()
      
      setVendas(vendasData)
      setProdutos(produtosData)
      setUtilizadores(utilizadoresData)
    } catch (error: any) {
      setErro(error.message || 'Não foi possível carregar os dados de vendas.')
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    buscarDados()
  }, [])

  useEffect(() => {
    if (sucesso) {
      const timer = setTimeout(() => setSucesso(''), 5000)
      return () => clearTimeout(timer)
    }
  }, [sucesso])

  const vendasFiltradas = useMemo(() => {
    return vendas.filter((venda) => {
      const nomeUsuario = venda.utilizador.nome.toLowerCase()
      const matchesUsuario = nomeUsuario.includes(buscaUsuario.toLowerCase())

      const dataVenda = new Date(venda.dataVenda)
      const inicioValido = dataInicio ? new Date(dataInicio) : null
      const fimValido = dataFim ? new Date(dataFim) : null

      const matchesInicio = inicioValido ? dataVenda >= inicioValido : true
      
      let matchesFim = true
      if (fimValido) {
        const limiteFim = new Date(fimValido.getTime() + (24 * 60 * 60 * 1000) - 1)
        matchesFim = dataVenda <= limiteFim
      }

      return matchesUsuario && matchesInicio && matchesFim
    })
  }, [vendas, buscaUsuario, dataInicio, dataFim])

  const totalVendas = vendasFiltradas.length

  const formatarData = (data: string) => {
    return new Intl.DateTimeFormat('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(data))
  }

  const fecharModal = () => setAbrirModal(false)

  const handleVendaSalva = () => {
    setSucesso('Venda registrada com sucesso.')
    fecharModal()
    buscarDados()
  }

  const handleExportarCSV = () => {
    window.location.href = '/api/vendas/exportar'
  }

  return (
    <div>
      <Navbar />
      <div className="lg:flex gap-6 max-w-7xl mx-auto px-4 py-8">
        <Sidebar />

        <main className="flex-1 space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold">🛒 Vendas</h1>
              <p className="text-gray-600 mt-1">Registre novas vendas e acompanhe lucros e produtos vendidos.</p>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={handleExportarCSV} className="gap-2">
                <FileSpreadsheet size={18} /> Exportar CSV
              </Button>
              <Button onClick={() => setAbrirModal(true)}>+ Nova Venda</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">Vendas exibidas</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">{totalVendas}</p>
            </div>
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm xl:col-span-2">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Buscar por utilizador</label>
                  <Input
                    value={buscaUsuario}
                    onChange={(event) => setBuscaUsuario(event.target.value)}
                    placeholder="Nome do utilizador"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data início</label>
                  <Input
                    type="date"
                    value={dataInicio}
                    onChange={(event) => setDataInicio(event.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data fim</label>
                  <Input
                    type="date"
                    value={dataFim}
                    onChange={(event) => setDataFim(event.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {carregando ? (
            <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-200">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              {sucesso && (
                <div className="rounded-3xl bg-emerald-50 p-6 text-emerald-700 border border-emerald-200">
                  {sucesso}
                </div>
              )}

              {erro && (
                <div className="rounded-3xl bg-red-50 p-6 text-red-700 border border-red-200">{erro}</div>
              )}

              <div className="overflow-x-auto rounded-3xl border border-gray-200 bg-white shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">ID</th>
                      <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Data</th>
                      <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Utilizador</th>
                      <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Total</th>
                      <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Lucro</th>
                      <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Itens</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {vendasFiltradas.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-6 text-center text-sm text-gray-500">
                          Nenhuma venda encontrada.
                        </td>
                      </tr>
                    ) : (
                      vendasFiltradas.map((venda) => (
                        <tr key={venda.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{venda.id}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{formatarData(venda.dataVenda)}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{venda.utilizador.nome}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-900">Kz{venda.total.toFixed(2)}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-green-700">Kz{venda.lucroTotal.toFixed(2)}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-600">{venda.itensVenda.length}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {abrirModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
              <div className="w-full max-w-4xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-semibold">Nova Venda</h2>
                    <p className="text-sm text-gray-500">Selecione produtos, defina quantidade e confirme a venda.</p>
                  </div>
                  <button
                    type="button"
                    onClick={fecharModal}
                    className="rounded-full border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Fechar
                  </button>
                </div>

                <FormVenda 
                  produtos={produtos} 
                  utilizadores={utilizadores} // Passar utilizadores para o formulário
                  onCancel={fecharModal} 
                  onSaved={handleVendaSalva} />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
