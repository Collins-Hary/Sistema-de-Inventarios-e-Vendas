import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Sistema de Inventário e Vendas",
  description: "Controle de stock e registos de vendas",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt">
      <body className="bg-gray-50">
        {children}
      </body>
    </html>
  )
}
