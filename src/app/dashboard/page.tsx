import Navbar from '@/components/Navbar'

export default function DashboardLayout() {
  return (
    <div>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">📊 Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-semibold uppercase">Total Vendas</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">€0.00</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-semibold uppercase">Total Lucro</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">€0.00</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-semibold uppercase">Produtos</h3>
            <p className="text-3xl font-bold text-purple-600 mt-2">0</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-semibold uppercase">Stock Baixo</h3>
            <p className="text-3xl font-bold text-red-600 mt-2">0</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">📈 Últimas Vendas</h2>
          <p className="text-gray-500">Carregando dados...</p>
        </div>
      </main>
    </div>
  )
}
