import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

interface ItemVendaPayload {
  produtoId: number | null
  quantidade: number | null
}

function parseInteger(value: unknown) {
  const num = Number(value)
  return Number.isInteger(num) ? num : null
}

function agruparItens(itens: ItemVendaPayload[]) {
  const mapa = new Map<number, number>()

  itens.forEach((item) => {
    if (item.produtoId == null || item.quantidade == null) {
      return
    }

    const quantidadeAtual = mapa.get(item.produtoId) ?? 0
    mapa.set(item.produtoId, quantidadeAtual + item.quantidade)
  })

  return Array.from(mapa.entries()).map(([produtoId, quantidade]) => ({
    produtoId,
    quantidade,
  }))
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id)
    if (Number.isNaN(id)) {
      return NextResponse.json({ erro: 'ID inválido' }, { status: 400 })
    }

    const venda = await prisma.venda.findUnique({
      where: { id },
      include: {
        utilizador: true,
        itensVenda: {
          include: {
            produto: true,
          },
        },
      },
    })

    if (!venda) {
      return NextResponse.json({ erro: 'Venda não encontrada' }, { status: 404 })
    }

    return NextResponse.json(venda, { status: 200 })
  } catch (erro) {
    console.error(erro)
    return NextResponse.json(
      { erro: 'Erro ao buscar venda' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id)
    if (Number.isNaN(id)) {
      return NextResponse.json({ erro: 'ID inválido' }, { status: 400 })
    }

    const dados = await request.json()
    const { utilizadorId, observacoes, itensVenda } = dados

    const vendaExistente = await prisma.venda.findUnique({
      where: { id },
      include: {
        itensVenda: true,
      },
    })

    if (!vendaExistente) {
      return NextResponse.json({ erro: 'Venda não encontrada' }, { status: 404 })
    }

    const updateData: any = {}

    if (utilizadorId != null) {
      const utilizadorIdNum = parseInteger(utilizadorId)
      if (!utilizadorIdNum) {
        return NextResponse.json(
          { erro: 'utilizadorId inválido' },
          { status: 400 }
        )
      }

      const utilizador = await prisma.utilizador.findUnique({
        where: { id: utilizadorIdNum },
      })

      if (!utilizador) {
        return NextResponse.json({ erro: 'Utilizador não encontrado' }, { status: 404 })
      }

      updateData.utilizador = { connect: { id: utilizadorIdNum } }
    }

    if (observacoes != null) {
      updateData.observacoes = observacoes?.trim() || null
    }

    let itemsData: ItemVendaPayload[] | null = null
    if (Array.isArray(itensVenda)) {
      if (itensVenda.length === 0) {
        return NextResponse.json(
          { erro: 'Itens da venda não podem ser vazios' },
          { status: 400 }
        )
      }

      itemsData = itensVenda.map((item: any) => ({
        produtoId: parseInteger(item.produtoId),
        quantidade: parseInteger(item.quantidade),
      }))

      if (itemsData.some((item) => !item.produtoId || !item.quantidade || item.quantidade <= 0)) {
        return NextResponse.json(
          { erro: 'Cada item deve ter produtoId e quantidade válidos maiores que zero' },
          { status: 400 }
        )
      }
    }

    let vendaAtualizada

    if (itemsData) {
      const itensAgrupados = agruparItens(itemsData)
      const produtoIds = Array.from(
        new Set([
          ...itensAgrupados.map((item) => item.produtoId),
          ...vendaExistente.itensVenda.map((item) => item.produtoId),
        ])
      )

      const produtos = await prisma.produto.findMany({
        where: { id: { in: produtoIds } },
      })

      if (produtos.length !== produtoIds.length) {
        return NextResponse.json(
          { erro: 'Um ou mais produtos não foram encontrados' },
          { status: 404 }
        )
      }

      const estoqueRestaurado = new Map<number, number>()
      vendaExistente.itensVenda.forEach((item) => {
        estoqueRestaurado.set(
          item.produtoId,
          (estoqueRestaurado.get(item.produtoId) ?? 0) + item.quantidade
        )
      })

      const produtoIdsTodos = new Set<number>([
        ...estoqueRestaurado.keys(),
        ...itensAgrupados.map((item) => item.produtoId),
      ])

      const updateStockOps = Array.from(produtoIdsTodos).map((produtoId) => {
        const produto = produtos.find((produto) => produto.id === produtoId)
        if (!produto) {
          throw new Error('Produto não encontrado durante a atualização de estoque')
        }

        const quantidadeAntiga = estoqueRestaurado.get(produtoId) ?? 0
        const quantidadeNova = itensAgrupados.find((item) => item.produtoId === produtoId)?.quantidade ?? 0
        const novoSaldo = produto.quantidade + quantidadeAntiga - quantidadeNova

        if (novoSaldo < 0) {
          throw new Error(`Estoque insuficiente para produto ${produto.nome}`)
        }

        return {
          produtoId: produto.id,
          novoSaldo,
        }
      })

      const itensParaCriar = itensAgrupados.map((item) => {
        const produto = produtos.find((produto) => produto.id === item.produtoId)!
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

      const total = itensParaCriar.reduce((acc, item) => acc + item.subtotal, 0)
      const lucroTotal = itensParaCriar.reduce(
        (acc, item) => acc + item.lucroUnitario * item.quantidade,
        0
      )

      vendaAtualizada = await prisma.$transaction(async (tx) => {
        const venda = await tx.venda.update({
          where: { id },
          data: {
            ...updateData,
            total,
            lucroTotal,
            itensVenda: {
              deleteMany: {},
              create: itensParaCriar,
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
          updateStockOps.map((item) =>
            tx.produto.update({
              where: { id: item.produtoId },
              data: {
                quantidade: item.novoSaldo,
              },
            })
          )
        )

        return venda
      })
    } else {
      vendaAtualizada = await prisma.venda.update({
        where: { id },
        data: updateData,
        include: {
          utilizador: true,
          itensVenda: {
            include: {
              produto: true,
            },
          },
        },
      })
    }

    return NextResponse.json(vendaAtualizada, { status: 200 })
  } catch (erro: any) {
    console.error(erro)
    if (String(erro.message).includes('Estoque insuficiente')) {
      return NextResponse.json({ erro: erro.message }, { status: 400 })
    }

    return NextResponse.json(
      { erro: 'Erro ao atualizar venda' },
      { status: 500 }
    )
  }
}
