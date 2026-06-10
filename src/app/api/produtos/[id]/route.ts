import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET - Buscar um produto pelo ID
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id)
    if (isNaN(id)) return NextResponse.json({ erro: 'ID inválido' }, { status: 400 })

    const produto = await prisma.produto.findUnique({
      where: { id },
      include: { categoria: true },
    })

    if (!produto) return NextResponse.json({ erro: 'Produto não encontrado' }, { status: 404 })

    return NextResponse.json(produto, { status: 200 })
  } catch (error) {
    return NextResponse.json({ erro: 'Erro ao buscar produto' }, { status: 500 })
  }
}

// PUT - Atualizar dados do produto
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id)
    if (isNaN(id)) return NextResponse.json({ erro: 'ID inválido' }, { status: 400 })

    const dados = await request.json()
    const { nome, descricao, preco, custo, quantidade, quantidadeMinima, categoriaId, ativo } = dados

    const produtoExistente = await prisma.produto.findUnique({ where: { id } })
    if (!produtoExistente) return NextResponse.json({ erro: 'Produto não encontrado' }, { status: 404 })

    const produtoAtualizado = await prisma.produto.update({
      where: { id },
      data: {
        nome: nome !== undefined ? nome.trim() : undefined,
        descricao: descricao !== undefined ? (descricao?.trim() || null) : undefined,
        preco: preco !== undefined ? Number(preco) : undefined,
        custo: custo !== undefined ? Number(custo) : undefined,
        quantidade: quantidade !== undefined ? Number(quantidade) : undefined,
        quantidadeMinima: quantidadeMinima !== undefined ? Number(quantidadeMinima) : undefined,
        categoriaId: categoriaId !== undefined ? Number(categoriaId) : undefined,
        ativo: ativo !== undefined ? !!ativo : undefined,
        atualizadoEm: new Date(),
      },
      include: { categoria: true },
    })

    return NextResponse.json(produtoAtualizado, { status: 200 })
  } catch (error: any) {
    console.error('Erro ao atualizar produto:', error)
    if (error.code === 'P2002') {
      return NextResponse.json({ erro: 'Já existe um produto com este nome' }, { status: 409 })
    }
    return NextResponse.json({ erro: 'Erro ao atualizar produto' }, { status: 500 })
  }
}

// DELETE - Excluir produto (apenas se não houver vendas vinculadas)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id)
    if (isNaN(id)) return NextResponse.json({ erro: 'ID inválido' }, { status: 400 })

    const produto = await prisma.produto.findUnique({
      where: { id },
      include: { _count: { select: { itensVenda: true } } }
    })

    if (!produto) return NextResponse.json({ erro: 'Produto não encontrado' }, { status: 404 })

    // Impedir exclusão se houver vendas vinculadas
    if (produto._count.itensVenda > 0) {
      return NextResponse.json({ 
        erro: 'Não é possível excluir um produto que possui registros de venda. Considere desativá-lo.' 
      }, { status: 400 })
    }

    await prisma.produto.delete({ where: { id } })

    return NextResponse.json({ mensagem: 'Produto excluído com sucesso' }, { status: 200 })
  } catch (error) {
    console.error('Erro ao excluir produto:', error)
    return NextResponse.json({ erro: 'Erro ao excluir produto' }, { status: 500 })
  }
}