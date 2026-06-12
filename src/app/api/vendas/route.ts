import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

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
    return NextResponse.json(vendas, { status: 200 })
  } catch (error) {
    return NextResponse.json({ erro: 'Erro ao listar vendas' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const dados = await request.json()
    const utilizadorId = Number(dados.utilizadorId)
    
    // Aceita tanto 'itens' quanto 'itensVenda' para evitar erros de integração
    const itensParaProcessar = dados.itens || dados.itensVenda

    const utilizador = await prisma.utilizador.findUnique({ where: { id: utilizadorId } })
    if (!utilizador) {
      return NextResponse.json({ erro: `Utilizador (ID ${utilizadorId}) não encontrado no sistema.` }, { status: 404 })
    }

    if (!itensParaProcessar || itensParaProcessar.length === 0) {
      return NextResponse.json({ erro: 'A venda deve ter pelo menos um item' }, { status: 400 })
    }

    const clienteId = dados.clienteId ? Number(dados.clienteId) : null
    const clienteDados = dados.cliente

    // Iniciar transação para garantir consistência entre Venda, Cliente e Estoque
    const resultado = await prisma.$transaction(async (tx) => {
      let totalVenda = 0
      let lucroTotalVenda = 0
      const itensParaCriar = []
      let clienteIdParaVenda: number | undefined = undefined

      if (clienteId) {
        const clienteExistente = await tx.cliente.findUnique({ where: { id: clienteId } })
        if (!clienteExistente) {
          throw new Error(`Cliente (ID ${clienteId}) não encontrado no sistema.`)
        }
        clienteIdParaVenda = clienteId
      } else if (clienteDados && clienteDados.nome?.trim()) {
        const novoCliente = await tx.cliente.create({
          data: {
            nome: clienteDados.nome.trim(),
            email: clienteDados.email?.trim() || null,
            telefone: clienteDados.telefone?.trim() || null,
          },
        })
        clienteIdParaVenda = novoCliente.id
      }

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
          utilizadorId: utilizadorId,
          clienteId: clienteIdParaVenda,
          observacoes: dados.observacoes?.trim() || null,
          total: totalVenda,
          lucroTotal: lucroTotalVenda,
          itensVenda: {
            create: itensParaCriar,
          },
        },
        include: {
          itensVenda: true,
          cliente: true,
        },
      })

      return novaVenda
    })

    return NextResponse.json(resultado, { status: 201 })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ erro: error.message || 'Erro ao processar venda' }, { status: 400 })
  }
}