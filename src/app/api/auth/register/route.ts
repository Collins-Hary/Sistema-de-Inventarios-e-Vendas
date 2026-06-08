import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const dados = await request.json()
    const { nome, email, senha } = dados

    if (!nome?.trim() || !email?.trim() || !senha?.trim()) {
      return NextResponse.json(
        { erro: 'Nome, email e senha são obrigatórios' },
        { status: 400 }
      )
    }

    const emailNormalizado = email.toLowerCase().trim()

    const usuarioExistente = await prisma.utilizador.findUnique({
      where: {
        email: emailNormalizado,
      },
    })

    if (usuarioExistente) {
      return NextResponse.json(
        { erro: 'Email já está em uso' },
        { status: 409 }
      )
    }

    const senhaHash = hashPassword(senha)

    const utilizador = await prisma.utilizador.create({
      data: {
        nome: nome.trim(),
        email: emailNormalizado,
        senha: senhaHash,
      },
    })

    return NextResponse.json(
      {
        id: utilizador.id,
        nome: utilizador.nome,
        email: utilizador.email,
      },
      { status: 201 }
    )
  } catch (erro) {
    console.error(erro)
    return NextResponse.json(
      { erro: 'Erro ao registrar usuário' },
      { status: 500 }
    )
  }
}
