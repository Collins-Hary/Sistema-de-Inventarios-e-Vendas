'use client'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface VendasChartProps {
  labels: string[]
  data: number[]
}

export default function VendasChart({ labels, data }: VendasChartProps) {
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Total de Vendas',
        data,
        backgroundColor: 'rgba(37, 99, 235, 0.8)',
        borderColor: 'rgba(37, 99, 235, 1)',
        borderWidth: 1,
      },
    ],
  }

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Vendas por mês',
        color: '#111827',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const value = context.parsed.y
            return `Kz${value.toFixed(2)}`
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#4b5563',
        },
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          color: '#4b5563',
          callback: function (value: any) {
            return `Kz${value}`
          },
        },
        grid: {
          color: 'rgba(229, 231, 235, 0.8)',
        },
      },
    },
  }

  return (
    <div className="h-[320px]">
      <Bar data={chartData} options={options} />
    </div>
  )
}
