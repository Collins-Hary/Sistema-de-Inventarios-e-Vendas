import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { generateAuthToken, verifyPassword } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const dados = await request.json()
    const { email, senha } = dados

    if (!email?.trim() || !senha?.trim()) {
      return NextResponse.json(
        { erro: 'Email e senha são obrigatórios' },
        { status: 400 }
      )
    }

    const utilizador = await prisma.utilizador.findUnique({
      where: {
        email: email.toLowerCase().trim(),
      },
    })

    if (!utilizador || !verifyPassword(senha, utilizador.senha)) {
      return NextResponse.json(
        { erro: 'Credenciais inválidas' },
        { status: 401 }
      )
    }

    const token = generateAuthToken()

    await prisma.utilizador.update({
      where: {
        id: utilizador.id,
      },
      data: {
        authToken: token,
      },
    })

    return NextResponse.json(
      {
        token,
        user: {
          id: utilizador.id,
          nome: utilizador.nome,
          email: utilizador.email,
        },
      },
      { status: 200 }
    )
  } catch (erro) {
    console.error(erro)
    return NextResponse.json(
      { erro: 'Erro ao efetuar login' },
      { status: 500 }
    )
  }
}
