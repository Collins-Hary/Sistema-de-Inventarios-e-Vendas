import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import VendasChart from '@/components/VendasChart'
import prisma from '@/lib/prisma'
import { formatarMoeda } from '@/lib/utils'
import GerarRelatorioPDF from '@/components/GerarRelatorioPDF'
// import Toast from '@/components/Toast'

async function getDashboardData() {
  const agora = new Date()
  const inicioDoMes = new Date(agora.getFullYear(), agora.getMonth(), 1)
  const inicioDoAno = new Date(agora.getFullYear(), 0, 1)
  const inicioUltimosSeisMeses = new Date(agora.getFullYear(), agora.getMonth() - 5, 1)

  const [produtos, vendas] = await Promise.all([
    prisma.produto.findMany({
      orderBy: { quantidade: 'asc' },
    }),
    prisma.venda.findMany({
      where: {
        dataVenda: {
          gte: inicioUltimosSeisMeses,
        },
      },
      orderBy: {
        dataVenda: 'asc',
      },
      include: {
        utilizador: true,
        cliente: true,
        itensVenda: {
          include: {
            produto: true,
          },
        },
      },
    }),
  ])

  const totalProdutos = produtos.length
  const produtosStockBaixo = produtos.filter(
    (produto) => produto.quantidade < produto.quantidadeMinima
  )

  const vendasEsteMes = vendas.filter(
    (venda) => venda.dataVenda >= inicioDoMes
  )
  const vendasEsteAno = vendas.filter(
    (venda) => venda.dataVenda >= inicioDoAno
  )

  const totalVendasMes = vendasEsteMes.reduce((acc, venda) => acc + venda.total, 0)
  const totalVendasAno = vendasEsteAno.reduce((acc, venda) => acc + venda.total, 0)
  const totalLucroAno = vendasEsteAno.reduce((acc, venda) => acc + venda.lucroTotal, 0)
  const totalLucroMes = vendasEsteMes.reduce((acc, venda) => acc + venda.lucroTotal, 0)
  const quantidadeVendasMes = vendasEsteMes.length
  const ticketMedioMes = quantidadeVendasMes > 0 ? totalVendasMes / quantidadeVendasMes : 0
  const margemMediaMes = totalVendasMes > 0 ? (totalLucroMes / totalVendasMes) * 100 : 0

  const inicioMesAnterior = new Date(agora.getFullYear(), agora.getMonth() - 1, 1)
  const fimMesAnterior = new Date(agora.getFullYear(), agora.getMonth(), 0)
  const vendasMesAnterior = vendas.filter(
    (venda) => venda.dataVenda >= inicioMesAnterior && venda.dataVenda <= fimMesAnterior
  )
  const totalVendasMesAnterior = vendasMesAnterior.reduce((acc, venda) => acc + venda.total, 0)
  const crescimentoVendasMes = totalVendasMesAnterior > 0
    ? ((totalVendasMes - totalVendasMesAnterior) / totalVendasMesAnterior) * 100
    : totalVendasMes > 0
    ? 100
    : 0

  const clienteAtendidos = new Set(
    vendas
      .filter((venda) => venda.clienteId != null)
      .map((venda) => venda.clienteId)
  )

  const clienteMap = new Map<number, { nome: string; totalCompras: number; compras: number }>()
  const vendedorMap = new Map<number, { nome: string; totalVendas: number; vendas: number; lucro: number }>()

  vendas.forEach((venda) => {
    if (venda.clienteId != null && venda.cliente) {
      const existente = clienteMap.get(venda.clienteId)
      if (!existente) {
        clienteMap.set(venda.clienteId, {
          nome: venda.cliente.nome,
          totalCompras: venda.total,
          compras: 1,
        })
      } else {
        existente.totalCompras += venda.total
        existente.compras += 1
      }
    }

    if (venda.utilizador) {
      const usuarioId = venda.utilizador.id
      const existente = vendedorMap.get(usuarioId)
      if (!existente) {
        vendedorMap.set(usuarioId, {
          nome: venda.utilizador.nome,
          totalVendas: venda.total,
          vendas: 1,
          lucro: venda.lucroTotal,
        })
      } else {
        existente.totalVendas += venda.total
        existente.vendas += 1
        existente.lucro += venda.lucroTotal
      }
    }
  })

  const topClientes = Array.from(clienteMap.values())
    .sort((a, b) => b.totalCompras - a.totalCompras)
    .slice(0, 5)

  const topVendedores = Array.from(vendedorMap.values())
    .sort((a, b) => b.totalVendas - a.totalVendas)
    .slice(0, 5)

  const produtoMap = new Map<number, { nome: string; quantidadeVendida: number; faturamento: number }>()
  vendas.forEach((venda) => {
    venda.itensVenda.forEach((item) => {
      const existente = produtoMap.get(item.produtoId)
      if (!existente) {
        produtoMap.set(item.produtoId, {
          nome: item.produto.nome,
          quantidadeVendida: item.quantidade,
          faturamento: item.subtotal,
        })
      } else {
        existente.quantidadeVendida += item.quantidade
        existente.faturamento += item.subtotal
      }
    })
  })

  const topProdutos = Array.from(produtoMap.values())
    .sort((a, b) => b.quantidadeVendida - a.quantidadeVendida)
    .slice(0, 5)

  const meses = Array.from({ length: 6 }, (_, index) => {
    const data = new Date(agora.getFullYear(), agora.getMonth() - (5 - index), 1)
    return {
      label: data.toLocaleString('pt-PT', { month: 'short', year: 'numeric' }),
      year: data.getFullYear(),
      month: data.getMonth(),
    }
  })

  const vendasPorMes = meses.map((mes) => {
    const total = vendas
      .filter(
        (venda) =>
          venda.dataVenda.getFullYear() === mes.year &&
          venda.dataVenda.getMonth() === mes.month
      )
      .reduce((acc, venda) => acc + venda.total, 0)

    return {
      label: mes.label,
      total,
    }
  })

  return {
    totalProdutos,
    produtosStockBaixo,
    totalVendasMes,
    totalVendasAno,
    totalLucroMes,
    totalLucroAno,
    quantidadeVendasMes,
    ticketMedioMes,
    margemMediaMes,
    crescimentoVendasMes,
    clienteAtendidos: clienteAtendidos.size,
    topProdutos,
    topClientes,
    topVendedores,
    vendasPorMes,
  }
}

export default async function DashboardLayout() {
  const {
    totalProdutos,
    produtosStockBaixo,
    totalVendasMes,
    totalVendasAno,
    totalLucroMes,
    totalLucroAno,
    quantidadeVendasMes,
    ticketMedioMes,
    margemMediaMes,
    crescimentoVendasMes,
    clienteAtendidos,
    topProdutos,
    topClientes,
    topVendedores,
    vendasPorMes,
  } = await getDashboardData()

  return (
    <div>
      <Navbar />
      <div className="lg:flex gap-6 max-w-7xl mx-auto px-4 py-8">
        <Sidebar />

        <main className="flex-1 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">📊 Dashboard</h1>
              <p className="text-gray-600">Visão geral das vendas, lucro e produtos com stock baixo.</p>
            </div>
            <GerarRelatorioPDF />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <span className="text-sm font-semibold uppercase text-gray-500">Total vendas (mês)</span>
              <p className="mt-4 text-3xl font-bold text-blue-600">{formatarMoeda(totalVendasMes)}</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <span className="text-sm font-semibold uppercase text-gray-500">Número de vendas (mês)</span>
              <p className="mt-4 text-3xl font-bold text-blue-700">{quantidadeVendasMes}</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <span className="text-sm font-semibold uppercase text-gray-500">Ticket médio (mês)</span>
              <p className="mt-4 text-3xl font-bold text-indigo-600">{formatarMoeda(ticketMedioMes)}</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <span className="text-sm font-semibold uppercase text-gray-500">Total lucro (mês)</span>
              <p className="mt-4 text-3xl font-bold text-green-600">{formatarMoeda(totalLucroMes)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <span className="text-sm font-semibold uppercase text-gray-500">Total vendas (ano)</span>
              <p className="mt-4 text-3xl font-bold text-teal-600">{formatarMoeda(totalVendasAno)}</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <span className="text-sm font-semibold uppercase text-gray-500">Margem média (mês)</span>
              <p className="mt-4 text-3xl font-bold text-emerald-600">{margemMediaMes.toFixed(2)}%</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <span className="text-sm font-semibold uppercase text-gray-500">Crescimento vs mês anterior</span>
              <p className="mt-4 text-3xl font-bold text-violet-600">{crescimentoVendasMes.toFixed(1)}%</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <span className="text-sm font-semibold uppercase text-gray-500">Clientes atendidos</span>
              <p className="mt-4 text-3xl font-bold text-cyan-600">{clienteAtendidos}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6">
            <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold">Gráfico de vendas</h2>
                  <p className="text-sm text-gray-500">Últimos 6 meses</p>
                </div>
              </div>

              <VendasChart
                labels={vendasPorMes.map((item) => item.label)}
                data={vendasPorMes.map((item) => item.total)}
              />
            </section>

            <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold mb-4">Produtos com pouco stock</h2>
              {produtosStockBaixo.length === 0 ? (
                <p className="text-gray-500">Nenhum produto está abaixo do stock mínimo.</p>
              ) : (
                <ul className="space-y-3">
                  {produtosStockBaixo.slice(0, 6).map((produto) => (
                    <li key={produto.id} className="rounded-2xl border border-red-100 bg-red-50 p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold">{produto.nome}</p>
                          <p className="text-sm text-gray-600">Mínimo: {produto.quantidadeMinima} • Atual: {produto.quantidade}</p>
                        </div>
                        <span className="text-sm font-semibold text-red-700">{produto.quantidade - produto.quantidadeMinima}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6">
            <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold">Top produtos vendidos</h2>
                  <p className="text-sm text-gray-500">Baseado na quantidade vendida nos últimos 6 meses</p>
                </div>
              </div>

              {topProdutos.length === 0 ? (
                <p className="text-gray-500">Nenhum dado de vendas disponível.</p>
              ) : (
                <ol className="space-y-4">
                  {topProdutos.map((produto, index) => (
                    <li key={produto.nome} className="rounded-2xl border border-gray-100 bg-slate-50 p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <span className="text-sm font-semibold text-gray-500">#{index + 1}</span>
                          <p className="mt-1 font-semibold text-gray-900">{produto.nome}</p>
                          <p className="text-sm text-gray-600">Vendidos: {produto.quantidadeVendida} unidades</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Faturamento</p>
                          <p className="font-semibold text-gray-900">{formatarMoeda(produto.faturamento)}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </section>

            <div className="space-y-6">
              <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold">Top clientes</h2>
                    <p className="text-sm text-gray-500">Clientes com maior faturamento</p>
                  </div>
                </div>

                {topClientes.length === 0 ? (
                  <p className="text-gray-500">Nenhum cliente registrado nas últimas vendas.</p>
                ) : (
                  <ol className="space-y-3">
                    {topClientes.map((cliente, index) => (
                      <li key={cliente.nome} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <span className="text-sm font-semibold text-gray-500">#{index + 1}</span>
                            <p className="mt-1 font-semibold text-gray-900">{cliente.nome}</p>
                            <p className="text-sm text-gray-600">Compras: {cliente.compras}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Total</p>
                            <p className="font-semibold text-gray-900">{formatarMoeda(cliente.totalCompras)}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ol>
                )}
              </section>

              <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold">Top vendedores</h2>
                    <p className="text-sm text-gray-500">Vendedores com maior faturamento</p>
                  </div>
                </div>

                {topVendedores.length === 0 ? (
                  <p className="text-gray-500">Nenhuma venda registrada.</p>
                ) : (
                  <ol className="space-y-3">
                    {topVendedores.map((vendedor, index) => (
                      <li key={vendedor.nome} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <span className="text-sm font-semibold text-gray-500">#{index + 1}</span>
                            <p className="mt-1 font-semibold text-gray-900">{vendedor.nome}</p>
                            <p className="text-sm text-gray-600">Vendas: {vendedor.vendas}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Faturamento</p>
                            <p className="font-semibold text-gray-900">{formatarMoeda(vendedor.totalVendas)}</p>
                            <p className="text-sm text-gray-600">Lucro: {formatarMoeda(vendedor.lucro)}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ol>
                )}
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
