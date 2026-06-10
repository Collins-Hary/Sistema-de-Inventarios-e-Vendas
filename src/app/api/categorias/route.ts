// Este ficheiro deve retornar apenas a lista de categorias.
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const categorias = await prisma.categoria.findMany({
      orderBy: { nome: 'asc' },
    })
    return NextResponse.json(categorias, { status: 200 })
  } catch (error) {
    return NextResponse.json({ erro: 'Erro ao listar categorias' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const dados = await request.json()
    const { nome, descricao } = dados

    if (!nome?.trim()) {
      return NextResponse.json({ erro: 'Nome da categoria é obrigatório' }, { status: 400 })
    }

    const categoria = await prisma.categoria.create({
      data: {
        nome: nome.trim(),
        descricao: descricao?.trim() || null,
      },
    })

    return NextResponse.json(categoria, { status: 201 })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ erro: 'Já existe uma categoria com este nome' }, { status: 409 })
    }
    return NextResponse.json({ erro: 'Erro ao criar categoria' }, { status: 500 })
  }
}