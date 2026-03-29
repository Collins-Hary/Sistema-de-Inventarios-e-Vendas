import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET - Listar todas as categorias
export async function GET() {
  try {
    const categorias = await prisma.categoria.findMany({
      include: {
        produtos: true,
      },
      orderBy: {
        criadorEm: 'desc',
      },
    })

    return NextResponse.json(categorias, { status: 200 })
  } catch (erro) {
    console.error(erro)
    return NextResponse.json(
      { erro: 'Erro ao listar categorias' },
      { status: 500 }
    )
  }
}

// POST - Criar nova categoria
export async function POST(request: NextRequest) {
  try {
    const dados = await request.json()
    const { nome, descricao } = dados

    if (!nome || nome.trim() === '') {
      return NextResponse.json(
        { erro: 'Nome da categoria é obrigatório' },
        { status: 400 }
      )
    }

    const categoriaExistente = await prisma.categoria.findUnique({
      where: { nome },
    })

    if (categoriaExistente) {
      return NextResponse.json(
        { erro: 'Categoria com este nome já existe' },
        { status: 409 }
      )
    }

    const categoria = await prisma.categoria.create({
      data: {
        nome,
        descricao: descricao || null,
      },
    })

    return NextResponse.json(categoria, { status: 201 })
  } catch (erro) {
    console.error(erro)
    return NextResponse.json(
      { erro: 'Erro ao criar categoria' },
      { status: 500 }
    )
  }
}
