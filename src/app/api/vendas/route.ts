import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

interface ItemVendaPayload {
  produtoId: number
  quantidade: number
}

function parseInteger(value: unknown) {
  const num = Number(value)
  return Number.isInteger(num) ? num : null
}

function agruparItens(itens: ItemVendaPayload[]) {
  const mapa = new Map<number, number>()

  itens.forEach((item) => {
    const quantidadeAtual = mapa.get(item.produtoId) ?? 0
    mapa.set(item.produtoId, quantidadeAtual + item.quantidade)
  })

  return Array.from(mapa.entries()).map(([produtoId, quantidade]) => ({
    produtoId,
    quantidade,
  }))
}

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
      orderBy: {
        dataVenda: 'desc',
      },
    })

    return NextResponse.json(vendas, { status: 200 })
  } catch (erro) {
    console.error(erro)
    return NextResponse.json(
      { erro: 'Erro ao listar vendas' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const dados = await request.json()
    const { utilizadorId, observacoes, itensVenda } = dados

    const utilizadorIdNum = parseInteger(utilizadorId)
    if (!utilizadorIdNum) {
      return NextResponse.json(
        { erro: 'utilizadorId inválido ou obrigatório' },
        { status: 400 }
      )
    }

    if (!Array.isArray(itensVenda) || itensVenda.length === 0) {
      return NextResponse.json(
        { erro: 'Itens da venda são obrigatórios' },
        { status: 400 }
      )
    }

    const itens = itensVenda.map((item: any) => ({
      produtoId: parseInteger(item.produtoId),
      quantidade: parseInteger(item.quantidade),
    }))

    if (itens.some((item) => !item.produtoId || !item.quantidade || item.quantidade <= 0)) {
      return NextResponse.json(
        { erro: 'Cada item deve ter produtoId e quantidade válidos maiores que zero' },
        { status: 400 }
      )
    }

    const itensAgrupados = agruparItens(itens)
    const produtoIds = itensAgrupados.map((item) => item.produtoId)

    const utilizador = await prisma.utilizador.findUnique({
      where: { id: utilizadorIdNum },
    })

    if (!utilizador) {
      return NextResponse.json(
        { erro: 'Utilizador não encontrado' },
        { status: 404 }
      )
    }

    const produtos = await prisma.produto.findMany({
      where: { id: { in: produtoIds } },
    })

    if (produtos.length !== produtoIds.length) {
      return NextResponse.json(
        { erro: 'Um ou mais produtos não foram encontrados' },
        { status: 404 }
      )
    }

    const itensData = itensAgrupados.map((item) => {
      const produto = produtos.find((produto) => produto.id === item.produtoId)!
      if (item.quantidade > produto.quantidade) {
        throw new Error(`Estoque insuficiente para produto ${produto.nome}`)
      }

      const precoUnitario = produto.preco
      const lucroUnitario = produto.preco - produto.custo
      const subtotal = precoUnitario * item.quantidade

      return {
        produtoId: produto.id,
        quantidade: item.quantidade,
        precoUnitario,
        lucroUnitario,
        subtotal,
      }
    })

    const total = itensData.reduce((acc, item) => acc + item.subtotal, 0)
    const lucroTotal = itensData.reduce((acc, item) => acc + item.lucroUnitario * item.quantidade, 0)

    const venda = await prisma.$transaction(async (tx) => {
      const vendaCriada = await tx.venda.create({
        data: {
          total,
          lucroTotal,
          observacoes: observacoes?.trim() || null,
          utilizador: {
            connect: { id: utilizadorIdNum },
          },
          itensVenda: {
            create: itensData,
          },
        },
        include: {
          utilizador: true,
          itensVenda: {
            include: {
              produto: true,
            },
          },
        },
      })

      await Promise.all(
        itensData.map((item) =>
          tx.produto.update({
            where: { id: item.produtoId },
            data: {
              quantidade: {
                decrement: item.quantidade,
              },
            },
          })
        )
      )

      return vendaCriada
    })

    return NextResponse.json(venda, { status: 201 })
  } catch (erro: any) {
    console.error(erro)
    if (String(erro.message).includes('Estoque insuficiente')) {
      return NextResponse.json({ erro: erro.message }, { status: 400 })
    }

    return NextResponse.json(
      { erro: 'Erro ao criar venda' },
      { status: 500 }
    )
  }
}
