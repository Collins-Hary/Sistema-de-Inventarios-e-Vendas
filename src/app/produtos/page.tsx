import Navbar from '@/components/Navbar'

export default function ProdutosPage() {
  return (
    <div>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">📦 Produtos</h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            + Novo Produto
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Produto Exemplo</h3>
            <p className="text-gray-500 text-sm mb-4">Descrição do produto</p>
            <div className="flex justify-between text-sm mb-4">
              <span>Preço: €10.00</span>
              <span>Stock: 0</span>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700">
                Editar
              </button>
              <button className="flex-1 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700">
                Deletar
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
