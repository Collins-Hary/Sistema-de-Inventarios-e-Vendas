'use client'

import { useState } from 'react'
import { FileDown } from 'lucide-react'
import Button from './Button'
import { formatarMoeda } from '@/lib/utils'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

export default function GerarRelatorioPDF() {
  const [loading, setLoading] = useState(false)

  const handleGerarPDF = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/relatorios/mensal')
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.erro || `Erro HTTP: ${response.status}`)
      }

      const data = await response.json()

      const doc = new jsPDF()
      
      // Cabeçalho Premium
      doc.setFontSize(22)
      doc.setTextColor(37, 99, 235) // Azul primário
      doc.text('Central de Inteligência de Negócio', 14, 20)
      
      doc.setFontSize(14)
      doc.setTextColor(100)
      doc.text(`Relatório de Performance: ${data.mes}`, 14, 30)
      doc.text(`Emitido em: ${new Date().toLocaleDateString('pt-PT')}`, 14, 37)

      // Tabela de Resumo Financeiro
      autoTable(doc, {
        startY: 45,
        head: [['Indicador Financeiro', 'Valor']],
        body: [
          ['Faturamento Bruto', formatarMoeda(data.resumo.totalVendas)],
          ['Lucro Líquido Estimado', formatarMoeda(data.resumo.totalLucro)],
          ['Volume de Transações', `${data.resumo.quantidadeVendas} vendas`],
        ],
        headStyles: { fillColor: [37, 99, 235] },
        styles: { fontSize: 12 }
      })

      // Tabela de Produtos Mais Vendidos
      const finalY = (doc as any).lastAutoTable.finalY || 80
      doc.setFontSize(16)
      doc.setTextColor(30)
      doc.text('Análise de Mix de Produtos (Top 10)', 14, finalY + 20)

      autoTable(doc, {
        startY: finalY + 25,
        head: [['Produto', 'Qtd. Vendida', 'Total Bruto']],
        body: data.produtosMaisVendidos.map((p: any) => [
          p.nome,
          p.quantidade.toString(),
          formatarMoeda(p.total)
        ]),
        headStyles: { fillColor: [75, 85, 99] }
      })

      doc.save(`Relatorio_Performance_${data.mes.replace(' ', '_')}.pdf`)
    } catch (error: any) {
      console.error('Erro ao gerar PDF:', error)
      alert(`Não foi possível gerar o PDF: ${error.message || 'Erro desconhecido'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleGerarPDF} disabled={loading} variant="secondary" className="gap-2 shadow-sm border-slate-200">
      <FileDown size={18} />
      {loading ? 'Processando Relatório...' : 'Exportar Performance (PDF)'}
    </Button>
  )
}