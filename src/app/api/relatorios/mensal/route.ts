import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const logs = await (prisma as any).auditoria.findMany({
      take: 50,
      orderBy: { data: 'desc' },
      include: { utilizador: { select: { nome: true } } }
    })
    return NextResponse.json(logs)
  } catch (error) {
    // Retorna vazio se a tabela de auditoria ainda não foi criada no banco
    return NextResponse.json([])
  }
}