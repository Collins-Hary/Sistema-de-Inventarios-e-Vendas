export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
      <div className="text-center text-white">
        <h1 className="text-5xl font-bold mb-4">Sistema de Inventário e Vendas</h1>
        <p className="text-xl mb-8 opacity-90">Controle de stock e registos de vendas</p>
        <div className="flex gap-4 justify-center">
          <a href="/dashboard" className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100">
            Dashboard
          </a>
          <a href="/produtos" className="px-6 py-3 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800">
            Produtos
          </a>
        </div>
      </div>
    </main>
  )
}
