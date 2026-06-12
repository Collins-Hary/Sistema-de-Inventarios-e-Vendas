import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const clientes = await prisma.cliente.findMany({
      orderBy: { nome: 'asc' },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
      },
    })

    return NextResponse.json(clientes, { status: 200 })
  } catch (error) {
    console.error('Erro ao listar clientes:', error)
    return NextResponse.json({ erro: 'Erro ao listar clientes' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const dados = await request.json()
    const nome = typeof dados.nome === 'string' ? dados.nome.trim() : ''
    const email = typeof dados.email === 'string' ? dados.email.trim() : null
    const telefone = typeof dados.telefone === 'string' ? dados.telefone.trim() : null

    if (!nome) {
      return NextResponse.json({ erro: 'Nome do cliente é obrigatório' }, { status: 400 })
    }

    const cliente = await prisma.cliente.create({
      data: {
        nome,
        email: email || null,
        telefone: telefone || null,
      },
    })

    return NextResponse.json(cliente, { status: 201 })
  } catch (error: any) {
    console.error('Erro ao cadastrar cliente:', error)
    if (String(error.message).includes('Unique constraint failed')) {
      return NextResponse.json({ erro: 'Já existe um cliente com esse email' }, { status: 409 })
    }
    return NextResponse.json({ erro: 'Erro ao cadastrar cliente' }, { status: 500 })
  }
}
