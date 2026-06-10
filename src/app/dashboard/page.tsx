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
  const totalLucroAno = vendasEsteAno.reduce((acc, venda) => acc + venda.lucroTotal, 0)

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
    totalLucroAno,
    vendasPorMes,
  }
}

export default async function DashboardLayout() {
  const {
    totalProdutos,
    produtosStockBaixo,
    totalVendasMes,
    totalLucroAno,
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
              <span className="text-sm font-semibold uppercase text-gray-500">Total lucro (ano)</span>
              <p className="mt-4 text-3xl font-bold text-green-600">{formatarMoeda(totalLucroAno)}</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <span className="text-sm font-semibold uppercase text-gray-500">Número de produtos</span>
              <p className="mt-4 text-3xl font-bold text-purple-600">{totalProdutos}</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <span className="text-sm font-semibold uppercase text-gray-500">Produtos com stock baixo</span>
              <p className="mt-4 text-3xl font-bold text-red-600">{produtosStockBaixo.length}</p>
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
        </main>
      </div>
    </div>
  )
}
