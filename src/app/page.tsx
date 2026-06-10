'use client'

import Link from 'next/link'
import { ArrowRight, BarChart3, ShieldCheck, TrendingUp, Zap, Clock } from 'lucide-react'
import Button from '@/components/Button'
import Navbar from '@/components/Navbar'

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      <Navbar />
      
      {/* Hero Section: Foco em Transformação */}
      <header className="relative overflow-hidden bg-white pt-16 pb-24 lg:pt-32 border-b border-slate-100">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold border border-blue-100 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <ShieldCheck size={16} />
              <span>Gestão de Alta Performance</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-black tracking-tight text-slate-900 leading-[1.1]">
              Transforme dados em lucro e <br />
              <span className="text-blue-600">caos em clareza.</span>
            </h1>
            
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              O SoftNet Inventários elimina o "prejuízo invisível". Controle seu estoque com precisão cirúrgica e visualize sua margem real em tempo real.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <Link href="/dashboard">
                <Button className="h-14 px-10 text-lg font-bold shadow-xl shadow-blue-200 transition-all hover:scale-105 active:scale-95">
                  Aceder ao Dashboard <ArrowRight className="ml-2" />
                </Button>
              </Link>
              <Link href="/produtos">
                <Button variant="secondary" className="h-14 px-10 text-lg font-bold border-slate-200 hover:bg-slate-50">
                  Gerir Inventário
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Elemento Visual Decorativo */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-3xl -z-10"></div>
      </header>

      {/* Proposta de Valor: Por que escolher? */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group p-8 rounded-3xl bg-white border border-slate-200 shadow-sm transition-all hover:border-blue-300 hover:shadow-lg">
              <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:rotate-3 transition-transform">
                <Zap size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-3">Velocidade Operacional</h3>
              <p className="text-slate-600 leading-relaxed">Registre vendas e entradas em segundos. Otimize o tempo da sua equipe para o que realmente importa: vender.</p>
            </div>

            <div className="group p-8 rounded-3xl bg-white border border-slate-200 shadow-sm transition-all hover:border-blue-300 hover:shadow-lg">
              <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:rotate-3 transition-transform">
                <TrendingUp size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-3">Lucratividade Real</h3>
              <p className="text-slate-600 leading-relaxed">Saiba exatamente quanto você ganha por item. Cruzamos custos e preços para entregar sua margem líquida sem erros.</p>
            </div>

            <div className="group p-8 rounded-3xl bg-white border border-slate-200 shadow-sm transition-all hover:border-blue-300 hover:shadow-lg">
              <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:rotate-3 transition-transform">
                <Clock size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-3">Ruptura Zero</h3>
              <p className="text-slate-600 leading-relaxed">Alertas inteligentes de stock baixo garantem que você nunca perca uma oportunidade por falta de produto.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Autoridade Estratégica */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 space-y-8">
              <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
                Não é apenas sobre contar itens, é sobre <span className="text-blue-400">tomar decisões.</span>
              </h2>
              <p className="text-xl text-slate-400 leading-relaxed italic">
                "Quem não mede, não gere. Quem não gere, não melhora."
              </p>
              <div className="space-y-4">
                {['Dashboards intuitivos e visuais', 'Arquitetura de dados segura e veloz', 'Exportação simplificada para relatórios'].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
                      <ShieldCheck size={16} />
                    </div>
                    <span className="text-lg font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex-1 bg-slate-800 p-2 rounded-[2.5rem] shadow-2xl border border-slate-700/50">
              <div className="bg-slate-900 rounded-[2rem] p-8 aspect-video flex flex-col justify-center items-center">
                <BarChart3 size={100} className="text-blue-500 animate-pulse" />
                <div className="mt-8 h-2 bg-slate-800 rounded-full w-48 overflow-hidden">
                  <div className="h-full bg-blue-500 w-2/3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA de Fechamento */}
      <section className="py-24 text-center">
        <div className="container mx-auto px-4 max-w-3xl space-y-8">
          <h2 className="text-4xl font-black">Comece a gerir como um profissional hoje.</h2>
          <p className="text-xl text-slate-600">Sua empresa merece uma gestão moderna e eficiente. Sem complicações, sem perda de tempo.</p>
          <Link href="/dashboard">
            <Button className="h-16 px-12 text-xl font-black">
              Ativar Minha Central de Vendas
            </Button>
          </Link>
        </div>
      </section>

      <footer className="py-12 border-t border-slate-200 bg-white">
        <div className="container mx-auto px-4 text-center text-slate-500 font-medium">
          <p>&copy; {new Date().getFullYear()} Collins SoftNet • Soluções em Gestão Inteligente</p>
        </div>
      </footer>
    </div>
  )
}
