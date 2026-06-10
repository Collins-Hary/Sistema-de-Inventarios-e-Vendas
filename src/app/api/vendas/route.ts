import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { enviarEmailAlertaStock } from '@/lib/email'

export async function GET() {
  try {
    const vendas = await prisma.venda.findMany({
      include: {
        utilizador: true,
        itensVenda: {
          include: {
            produto: true,
          },
        },
      },
      orderBy: { dataVenda: 'desc' },
    })
    return NextResponse.json(vendas, { status: 200 })
  } catch (error) {
    return NextResponse.json({ erro: 'Erro ao listar vendas' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const dados = await request.json()
    
    // Aceita tanto 'itens' quanto 'itensVenda' para evitar erros de integração
    const itensParaProcessar = dados.itens || dados.itensVenda

    if (!itensParaProcessar || itensParaProcessar.length === 0) {
      return NextResponse.json({ erro: 'A venda deve ter pelo menos um item' }, { status: 400 })
    }

    // Iniciar transação para garantir consistência entre Venda e Estoque
    const resultado = await prisma.$transaction(async (tx) => {
      let totalVenda = 0
      let lucroTotalVenda = 0
      const itensParaCriar = []

      for (const item of itensParaProcessar) {
        const produto = await tx.produto.findUnique({
          where: { id: item.produtoId },
        })

        if (!produto) throw new Error(`Produto ${item.produtoId} não encontrado`)
        if (produto.quantidade < item.quantidade) {
          throw new Error(`Estoque insuficiente para o produto: ${produto.nome}`)
        }

        const subtotal = produto.preco * item.quantidade
        const lucroUnitario = produto.preco - produto.custo
        
        totalVenda += subtotal
        lucroTotalVenda += lucroUnitario * item.quantidade

        itensParaCriar.push({
          produtoId: produto.id,
          quantidade: item.quantidade,
          precoUnitario: produto.preco,
          lucroUnitario: lucroUnitario,
          subtotal: subtotal,
        })

        // Atualizar estoque
        await tx.produto.update({
          where: { id: produto.id },
          data: { quantidade: { decrement: item.quantidade } },
        })
      }

      const novaVenda = await tx.venda.create({
        data: {
          utilizadorId: dados.utilizadorId, // Assumindo que utilizadorId vem nos dados
          observacoes: dados.observacoes,
          total: totalVenda,
          lucroTotal: lucroTotalVenda,
          itensVenda: {
            create: itensParaCriar,
          },
        },
        include: { itensVenda: true },
      })

      return novaVenda
    })

    // Verificação de stock baixo após a criação da venda para disparar alertas por email
    const vendaCompleta = await prisma.venda.findUnique({
      where: { id: resultado.id },
      include: { itensVenda: { include: { produto: true } } }
    })

    vendaCompleta?.itensVenda.forEach((item) => {
      const p = item.produto
      if (p.quantidade < p.quantidadeMinima) {
        enviarEmailAlertaStock(p.nome, p.quantidade, p.quantidadeMinima)
      }
    })

    return NextResponse.json(resultado, { status: 201 })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ erro: error.message || 'Erro ao processar venda' }, { status: 400 })
  }
}