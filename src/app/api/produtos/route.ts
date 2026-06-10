import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET - Listar todos os produtos
export async function GET() {
  try {
    const produtos = await prisma.produto.findMany({
      include: { categoria: true },
      orderBy: { nome: 'asc' },
    })
    
    return NextResponse.json(produtos, { status: 200 })
  } catch (error) {
    console.error('Erro ao listar produtos:', error)
    return NextResponse.json({ erro: 'Erro ao listar produtos' }, { status: 500 })
  }
}

// POST - Criar novo produto
export async function POST(request: NextRequest) {
  try {
    const dados = await request.json()
    const { nome, descricao, preco, custo, quantidade, quantidadeMinima, categoriaId, ativo } = dados

    // Validação básica de campos
    if (!nome?.trim() || preco == null || custo == null || categoriaId == null) {
      return NextResponse.json(
        { erro: 'Campos obrigatórios: nome, preço, custo e categoria.' },
        { status: 400 }
      )
    }

    const produto = await prisma.produto.create({
      data: {
        nome: nome.trim(),
        descricao: descricao?.trim() || null,
        preco: Number(preco),
        custo: Number(custo),
        quantidade: Number(quantidade || 0),
        quantidadeMinima: Number(quantidadeMinima || 0),
        categoriaId: Number(categoriaId),
        ativo: ativo !== undefined ? !!ativo : true,
      },
      include: { categoria: true },
    })

    return NextResponse.json(produto, { status: 201 })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ erro: 'Já existe um produto com este nome' }, { status: 409 })
    }
    return NextResponse.json({ erro: 'Erro ao criar produto' }, { status: 500 })
  }
}