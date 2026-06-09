import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id)
    if (Number.isNaN(id)) {
      return NextResponse.json(
        { erro: 'ID inválido' },
        { status: 400 }
      )
    }

    const produto = await prisma.produto.findUnique({
      where: { id },
      include: {
        categoria: true,
      },
    })

    if (!produto) {
      return NextResponse.json(
        { erro: 'Produto não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(produto, { status: 200 })
  } catch (erro) {
    console.error(erro)
    return NextResponse.json(
      { erro: 'Erro ao buscar produto' },
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
      return NextResponse.json(
        { erro: 'ID inválido' },
        { status: 400 }
      )
    }

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

    const produtoExistente = await prisma.produto.findUnique({
      where: { id },
    })

    if (!produtoExistente) {
      return NextResponse.json(
        { erro: 'Produto não encontrado' },
        { status: 404 }
      )
    }

    const updateData: any = {}

    if (nome != null) {
      if (!nome?.trim()) {
        return NextResponse.json(
          { erro: 'Nome do produto não pode ser vazio' },
          { status: 400 }
        )
      }
      updateData.nome = nome.trim()
    }

    if (descricao != null) {
      updateData.descricao = descricao.trim() || null
    }

    if (preco != null) {
      const precoNum = Number(preco)
      if (Number.isNaN(precoNum) || precoNum < 0) {
        return NextResponse.json(
          { erro: 'Preço deve ser um número válido maior ou igual a zero' },
          { status: 400 }
        )
      }
      updateData.preco = precoNum
    }

    if (custo != null) {
      const custoNum = Number(custo)
      if (Number.isNaN(custoNum) || custoNum < 0) {
        return NextResponse.json(
          { erro: 'Custo deve ser um número válido maior ou igual a zero' },
          { status: 400 }
        )
      }
      updateData.custo = custoNum
    }

    if (quantidade != null) {
      const quantidadeNum = Number(quantidade)
      if (Number.isNaN(quantidadeNum) || quantidadeNum < 0) {
        return NextResponse.json(
          { erro: 'Quantidade deve ser um número inteiro maior ou igual a zero' },
          { status: 400 }
        )
      }
      updateData.quantidade = quantidadeNum
    }

    if (quantidadeMinima != null) {
      const quantidadeMinimaNum = Number(quantidadeMinima)
      if (Number.isNaN(quantidadeMinimaNum) || quantidadeMinimaNum < 0) {
        return NextResponse.json(
          { erro: 'Quantidade mínima deve ser um número inteiro maior ou igual a zero' },
          { status: 400 }
        )
      }
      updateData.quantidadeMinima = quantidadeMinimaNum
    }

    if (categoriaId != null) {
      const categoriaIdNum = Number(categoriaId)
      if (Number.isNaN(categoriaIdNum)) {
        return NextResponse.json(
          { erro: 'Categoria ID inválido' },
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

      updateData.categoriaId = categoriaIdNum
    }

    if (ativo != null) {
      updateData.ativo = Boolean(ativo)
    }

    const produtoAtualizado = await prisma.produto.update({
      where: { id },
      data: updateData,
      include: {
        categoria: true,
      },
    })

    return NextResponse.json(produtoAtualizado, { status: 200 })
  } catch (erro) {
    console.error(erro)
    return NextResponse.json(
      { erro: 'Erro ao atualizar produto' },
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
    if (Number.isNaN(id)) {
      return NextResponse.json(
        { erro: 'ID inválido' },
        { status: 400 }
      )
    }

    const produtoExistente = await prisma.produto.findUnique({
      where: { id },
    })

    if (!produtoExistente) {
      return NextResponse.json(
        { erro: 'Produto não encontrado' },
        { status: 404 }
      )
    }

    await prisma.produto.delete({
      where: { id },
    })

    return NextResponse.json(
      { mensagem: 'Produto deletado com sucesso' },
      { status: 200 }
    )
  } catch (erro) {
    console.error(erro)
    return NextResponse.json(
      { erro: 'Erro ao deletar produto' },
      { status: 500 }
    )
  }
}
