import Navbar from '@/components/Navbar'

export default function VendasPage() {
  return (
    <div>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">🛒 Vendas</h1>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            + Nova Venda
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Data</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Total</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Lucro</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-gray-50">
                <td className="px-6 py-3 text-sm">-</td>
                <td className="px-6 py-3 text-sm">-</td>
                <td className="px-6 py-3 text-sm">€0.00</td>
                <td className="px-6 py-3 text-sm">€0.00</td>
                <td className="px-6 py-3 text-sm">
                  <button className="text-blue-600 hover:text-blue-800 mr-2">Ver</button>
                  <button className="text-red-600 hover:text-red-800">Deletar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
