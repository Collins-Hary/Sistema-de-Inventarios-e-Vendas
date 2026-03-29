'use client'

export default function AlertStockBaixo({ produtos }: { produtos: any[] }) {
  const produtosBaixos = produtos.filter(p => p.quantidade < p.quantidadeMinima)

  if (produtosBaixos.length === 0) {
    return null
  }

  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
      <h3 className="text-red-800 font-bold mb-2">⚠️ Alerta de Stock Baixo</h3>
      <ul className="text-red-700 space-y-1">
        {produtosBaixos.map((produto) => (
          <li key={produto.id}>
            <strong>{produto.nome}</strong> - {produto.quantidade} unidades (mínimo: {produto.quantidadeMinima})
          </li>
        ))}
      </ul>
    </div>
  )
}
