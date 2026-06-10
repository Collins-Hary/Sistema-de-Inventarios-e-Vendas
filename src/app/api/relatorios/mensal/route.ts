import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(_request: NextRequest) {
  const agora = new Date()
  const inicioDoMes = new Date(agora.getFullYear(), agora.getMonth(), 1)
  const fimDoMes = new Date(agora.getFullYear(), agora.getMonth() + 1, 0, 23, 59, 59)

  try {
    const vendas = await prisma.venda.findMany({
      where: {
        dataVenda: {
          gte: inicioDoMes,
          lte: fimDoMes,
        },
      },
      include: {
        itensVenda: {
          include: {
            produto: true,
          },
        },
      },
    })

    const totalVendas = vendas.reduce((acc, v) => acc + v.total, 0)
    const totalLucro = vendas.reduce((acc, v) => acc + v.lucroTotal, 0)

    const statsProdutos: Record<number, { nome: string; quantidade: number; total: number }> = {}

    vendas.forEach((venda) => {
      venda.itensVenda.forEach((item) => {
        if (!statsProdutos[item.produtoId]) {
          statsProdutos[item.produtoId] = {
            nome: item.produto.nome,
            quantidade: 0,
            total: 0,
          }
        }
        statsProdutos[item.produtoId].quantidade += item.quantidade
        statsProdutos[item.produtoId].total += item.subtotal
      })
    })

    const produtosMaisVendidos = Object.values(statsProdutos)
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 10)

    return NextResponse.json({
      mes: agora.toLocaleString('pt-PT', { month: 'long', year: 'numeric' }),
      resumo: {
        totalVendas,
        totalLucro,
        quantidadeVendas: vendas.length,
      },
      produtosMaisVendidos,
    })
  } catch (error) {
    return NextResponse.json({ erro: 'Erro ao coletar dados para o relatório' }, { status: 500 })
  }
}