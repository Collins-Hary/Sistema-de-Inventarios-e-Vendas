import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const produtos = await prisma.produto.findMany({
      include: {
        categoria: true,
      },
      orderBy: {
        criadorEm: 'desc',
      },
    })

    return NextResponse.json(produtos, { status: 200 })
  } catch (erro) {
    console.error(erro)
    return NextResponse.json(
      { erro: 'Erro ao listar produtos' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const dados = await request.json()
    const {
      nome,
      descricao,
      preco,
      custo,
      quantidade,
      quantidadeMinima,
      categoriaId,
      ativo,
    } = dados

    if (!nome?.trim()) {
      return NextResponse.json(
        { erro: 'Nome do produto é obrigatório' },
        { status: 400 }
      )
    }

    if (categoriaId == null) {
      return NextResponse.json(
        { erro: 'Categoria é obrigatória' },
        { status: 400 }
      )
    }

    if (preco == null || custo == null || quantidade == null || quantidadeMinima == null) {
      return NextResponse.json(
        { erro: 'Preço, custo, quantidade e quantidade mínima são obrigatórios' },
        { status: 400 }
      )
    }

    const precoNum = Number(preco)
    const custoNum = Number(custo)
    const quantidadeNum = Number(quantidade)
    const quantidadeMinimaNum = Number(quantidadeMinima)
    const categoriaIdNum = Number(categoriaId)

    if (Number.isNaN(precoNum) || precoNum < 0) {
      return NextResponse.json(
        { erro: 'Preço deve ser um número válido maior ou igual a zero' },
        { status: 400 }
      )
    }

    if (Number.isNaN(custoNum) || custoNum < 0) {
      return NextResponse.json(
        { erro: 'Custo deve ser um número válido maior ou igual a zero' },
        { status: 400 }
      )
    }

    if (Number.isNaN(quantidadeNum) || quantidadeNum < 0) {
      return NextResponse.json(
        { erro: 'Quantidade deve ser um número inteiro maior ou igual a zero' },
        { status: 400 }
      )
    }

    if (Number.isNaN(quantidadeMinimaNum) || quantidadeMinimaNum < 0) {
      return NextResponse.json(
        { erro: 'Quantidade mínima deve ser um número inteiro maior ou igual a zero' },
        { status: 400 }
      )
    }

    const categoria = await prisma.categoria.findUnique({
      where: { id: categoriaIdNum },
    })

    if (!categoria) {
      return NextResponse.json(
        { erro: 'Categoria não encontrada' },
        { status: 404 }
      )
    }

    const produto = await prisma.produto.create({
      data: {
        nome: nome.trim(),
        descricao: descricao?.trim() || null,
        preco: precoNum,
        custo: custoNum,
        quantidade: quantidadeNum,
        quantidadeMinima: quantidadeMinimaNum,
        ativo: ativo === false ? false : true,
        categoriaId: categoriaIdNum,
      },
      include: {
        categoria: true,
      },
    })

    return NextResponse.json(produto, { status: 201 })
  } catch (erro) {
    console.error(erro)
    return NextResponse.json(
      { erro: 'Erro ao criar produto' },
      { status: 500 }
    )
  }
}
