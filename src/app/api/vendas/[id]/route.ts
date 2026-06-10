import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { enviarEmailAlertaStock } from '@/lib/email'

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

    const vendaAtualizada = await prisma.$transaction(async (tx) => {
      const vendaExistente = await tx.venda.findUnique({
        where: { id },
        include: { itensVenda: true },
      })

      if (!vendaExistente) {
        throw new Error('VENDA_NAO_ENCONTRADA')
      }

      if (!itemsData) {
        return await tx.venda.update({
          where: { id },
          data: updateData,
          include: { utilizador: true, itensVenda: { include: { produto: true } } },
        })
      }

      const itensAgrupados = agruparItens(itemsData)
      const produtoIds = Array.from(new Set([
        ...itensAgrupados.map((i) => i.produtoId),
        ...vendaExistente.itensVenda.map((i) => i.produtoId),
      ]))

      const produtos = await tx.produto.findMany({
        where: { id: { in: produtoIds } },
      })

      const estoqueRestaurado = new Map<number, number>()
      vendaExistente.itensVenda.forEach((item) => {
        estoqueRestaurado.set(item.produtoId, (estoqueRestaurado.get(item.produtoId) ?? 0) + item.quantidade)
      })

      const updateStockOps = produtoIds.map((pId) => {
        const produto = produtos.find((p) => p.id === pId)
        if (!produto) throw new Error('PRODUTO_NAO_ENCONTRADO')

        const qAntiga = estoqueRestaurado.get(pId) ?? 0
        const qNova = itensAgrupados.find((i) => i.produtoId === pId)?.quantidade ?? 0
        const novoSaldo = produto.quantidade + qAntiga - qNova

        if (novoSaldo < 0) throw new Error(`Estoque insuficiente para produto ${produto.nome}`)
        return { id: pId, novoSaldo }
      })

      const itensParaCriar = itensAgrupados.map((item) => {
        const p = produtos.find((p) => p.id === item.produtoId)!
        return {
          produtoId: p.id,
          quantidade: item.quantidade,
          precoUnitario: p.preco,
          lucroUnitario: p.preco - p.custo,
          subtotal: p.preco * item.quantidade,
        }
      })

      const total = itensParaCriar.reduce((acc, i) => acc + i.subtotal, 0)
      const lucroTotal = itensParaCriar.reduce((acc, i) => acc + (i.lucroUnitario * i.quantidade), 0)

      await Promise.all(updateStockOps.map((op) => 
        tx.produto.update({ where: { id: op.id }, data: { quantidade: op.novoSaldo } })
      ))

      return await tx.venda.update({
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
        include: { utilizador: true, itensVenda: { include: { produto: true } } },
      })
    })

    // Verificação de stock baixo pós-venda para disparar alertas
    vendaAtualizada.itensVenda.forEach((item: any) => {
      const p = item.produto
      // Garante que p.quantidadeMinima existe antes de comparar
      if (p.quantidadeMinima === undefined || p.quantidadeMinima === null) {
        p.quantidadeMinima = 0; // Define um valor padrão se não estiver definido
      }
      if (p.quantidade < p.quantidadeMinima) {
        enviarEmailAlertaStock(p.nome, p.quantidade, p.quantidadeMinima)
      }
    })

    return NextResponse.json(vendaAtualizada, { status: 200 })
  } catch (erro: any) {
    console.error(erro)
    if (erro.message === 'VENDA_NAO_ENCONTRADA') return NextResponse.json({ erro: 'Venda não encontrada' }, { status: 404 })
    if (erro.message === 'PRODUTO_NAO_ENCONTRADO') return NextResponse.json({ erro: 'Um ou mais produtos não foram encontrados' }, { status: 404 })
    if (String(erro.message).includes('Estoque insuficiente')) {
      return NextResponse.json({ erro: erro.message }, { status: 400 })
    }

    return NextResponse.json(
      { erro: 'Erro ao atualizar venda' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id)
    if (Number.isNaN(id)) return NextResponse.json({ erro: 'ID inválido' }, { status: 400 })

    await prisma.$transaction(async (tx) => {
      const venda = await tx.venda.findUnique({
        where: { id },
        include: { itensVenda: true },
      })

      if (!venda) throw new Error('NOT_FOUND')

      // Devolver estoque
      await Promise.all(venda.itensVenda.map((item) =>
        tx.produto.update({
          where: { id: item.produtoId },
          data: { quantidade: { increment: item.quantidade } },
        })
      ))

      await tx.itemVenda.deleteMany({ where: { vendaId: id } })
      await tx.venda.delete({ where: { id } })
    })

    return NextResponse.json({ mensagem: 'Venda excluída com sucesso' }, { status: 200 })
  } catch (erro: any) {
    if (erro.message === 'NOT_FOUND') return NextResponse.json({ erro: 'Venda não encontrada' }, { status: 404 })
    return NextResponse.json({ erro: 'Erro ao excluir venda' }, { status: 500 })
  }
}
