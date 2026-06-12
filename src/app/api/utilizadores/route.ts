import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const utilizadores = await prisma.utilizador.findMany({
      select: {
        id: true,
        nome: true,
        role: true,
      },
      orderBy: {
        nome: 'asc',
      },
    })

    return NextResponse.json(utilizadores, { status: 200 })
  } catch (error) {
    console.error('Erro ao listar utilizadores:', error)
    return NextResponse.json({ erro: 'Erro ao listar utilizadores' }, { status: 500 })
  }
}
