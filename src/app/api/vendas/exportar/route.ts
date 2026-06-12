import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

function escapeCsv(value: unknown) {
  if (value === null || value === undefined) return ''
  return `"${String(value).replace(/"/g, '""')}"`
}

export async function GET() {
  try {
    const vendas = await prisma.venda.findMany({
      include: {
        utilizador: true,
        cliente: true,
        itensVenda: {
          include: {
            produto: true,
          },
        },
      },
      orderBy: { dataVenda: 'desc' },
    })

    const header = [
      'ID',
      'Data da Venda',
      'Utilizador',
      'Função do Utilizador',
      'Cliente',
      'Total',
      'Lucro Total',
      'Observações',
      'Itens',
      'Produtos'
    ]

    const linhas = vendas.map((venda) => {
      const produtos = venda.itensVenda
        .map((item) => `${item.produto.nome} (${item.quantidade}x)`)
        .join('; ')

      return [
        escapeCsv(venda.id),
        escapeCsv(venda.dataVenda.toISOString()),
        escapeCsv(venda.utilizador.nome),
        escapeCsv(venda.utilizador.role ?? ''),
        escapeCsv(venda.cliente?.nome ?? ''),
        escapeCsv(venda.total.toFixed(2)),
        escapeCsv(venda.lucroTotal.toFixed(2)),
        escapeCsv(venda.observacoes ?? ''),
        escapeCsv(venda.itensVenda.length),
        escapeCsv(produtos),
      ].join(',')
    })

    const csv = [header.join(','), ...linhas].join('\r\n')

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="vendas_export.csv"',
      },
    })
  } catch (error) {
    console.error('Erro ao exportar vendas:', error)
    return NextResponse.json({ erro: 'Erro ao exportar vendas' }, { status: 500 })
  }
}
