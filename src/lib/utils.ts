export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR',
  }).format(valor)
}

export function calcularLucro(preco: number, custo: number, quantidade: number): number {
  return (preco - custo) * quantidade
}

export function verificarStockBaixo(quantidade: number, quantidadeMinima: number): boolean {
  return quantidade < quantidadeMinima
}

export function formatarData(data: Date | string): string {
  return new Intl.DateTimeFormat('pt-PT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(data))
}

export function truncarTexto(texto: string, comprimento: number = 50): string {
  return texto.length > comprimento ? texto.slice(0, comprimento) + '...' : texto
}
