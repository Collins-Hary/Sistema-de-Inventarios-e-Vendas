import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET - Ver detalhes de uma categoria
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    const categoria = await prisma.categoria.findUnique({
      where: { id },
      include: {
        produtos: true,
      },
    })

    if (!categoria) {
      return NextResponse.json(
        { erro: 'Categoria não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(categoria, { status: 200 })
  } catch (erro) {
    console.error(erro)
    return NextResponse.json(
      { erro: 'Erro ao buscar categoria' },
      { status: 500 }
    )
  }
}

// PUT - Atualizar categoria
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const dados = await request.json()
    const { nome, descricao } = dados

    const categoria = await prisma.categoria.findUnique({
      where: { id },
    })

    if (!categoria) {
      return NextResponse.json(
        { erro: 'Categoria não encontrada' },
        { status: 404 }
      )
    }

    const categoriaAtualizada = await prisma.categoria.update({
      where: { id },
      data: {
        nome: nome || categoria.nome,
        descricao: descricao || categoria.descricao,
        atualizadoEm: new Date(),
      },
    })

    return NextResponse.json(categoriaAtualizada, { status: 200 })
  } catch (erro) {
    console.error(erro)
    return NextResponse.json(
      { erro: 'Erro ao atualizar categoria' },
      { status: 500 }
    )
  }
}

// DELETE - Deletar categoria
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    const categoria = await prisma.categoria.findUnique({
      where: { id },
    })

    if (!categoria) {
      return NextResponse.json(
        { erro: 'Categoria não encontrada' },
        { status: 404 }
      )
    }

    await prisma.categoria.delete({
      where: { id },
    })

    return NextResponse.json(
      { mensagem: 'Categoria deletada com sucesso' },
      { status: 200 }
    )
  } catch (erro) {
    console.error(erro)
    return NextResponse.json(
      { erro: 'Erro ao deletar categoria' },
      { status: 500 }
    )
  }
}
