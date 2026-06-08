import { randomBytes, scryptSync, timingSafeEqual } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import prisma from './prisma'

const SALT_LENGTH = 16
const KEY_LENGTH = 64

export function hashPassword(senha: string) {
  const salt = randomBytes(SALT_LENGTH).toString('hex')
  const hash = scryptSync(senha, salt, KEY_LENGTH).toString('hex')
  return `${salt}:${hash}`
}

export function verifyPassword(senha: string, storedHash: string) {
  const [salt, hash] = storedHash.split(':')
  if (!salt || !hash) {
    return false
  }

  const derivedHash = scryptSync(senha, salt, KEY_LENGTH)
  const hashBuffer = Buffer.from(hash, 'hex')

  if (hashBuffer.length !== derivedHash.length) {
    return false
  }

  return timingSafeEqual(hashBuffer, derivedHash)
}

export function generateAuthToken() {
  return randomBytes(48).toString('hex')
}

export async function requireAuthentication(request: NextRequest) {
  const authorization = request.headers.get('authorization')

  if (!authorization?.startsWith('Bearer ')) {
    return null
  }

  const token = authorization.slice(7).trim()
  if (!token) {
    return null
  }

  return prisma.utilizador.findFirst({
    where: {
      authToken: token,
    },
  })
}

export async function authMiddleware(request: NextRequest) {
  const utilizador = await requireAuthentication(request)

  if (!utilizador) {
    return NextResponse.json({ erro: 'Não autorizado' }, { status: 401 })
  }

  const response = NextResponse.next()
  response.headers.set('x-utilizador-id', utilizador.id.toString())
  return response
}
