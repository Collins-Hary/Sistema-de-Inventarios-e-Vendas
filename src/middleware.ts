import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  // Permite todas as requisições de API por enquanto para garantir funcionalidade
  // Em produção, aqui deve ser checado o authToken no cabeçalho ou cookie
  return NextResponse.next()
}

export const config = {
  matcher: ['/api/:path*'],
}
