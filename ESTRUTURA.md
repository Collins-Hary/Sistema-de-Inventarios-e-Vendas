# 📁 ESTRUTURA DO PROJETO - Mapa Completo

## Visualização em Árvore

```
Sistema-de-Inventarios-e-Vendas/
│
├── 📄 [Ficheiros Raiz]
│   ├── package.json                      (Dependências e scripts)
│   ├── tsconfig.json                     (Config TypeScript)
│   ├── next.config.js                    (Config Next.js)
│   ├── tailwind.config.js                (Config Tailwind)
│   ├── postcss.config.js                 (Config PostCSS)
│   ├── .env.example                      (Template de .env)
│   ├── .gitignore                        (Ficheiros a ignorar)
│   └── LICENSE                           (Licença do projeto)
│
├── 📚 [Documentação - LEIA PRIMEIRO]
│   ├── GUIA_COMECO.md                    ⭐ Comece aqui!
│   ├── PLANO_CONSTRUCAO.md               (Plano detalhado)
│   ├── README_SETUP.md                   (Guia de setup)
│   ├── STATUS.md                         (Status do projeto)
│   └── ESTRUTURA.md                      (Este ficheiro)
│
├── 📂 src/
│   │
│   ├── 📂 app/
│   │   │
│   │   ├── 📄 layout.tsx                 (Layout raiz)
│   │   ├── 📄 page.tsx                   (Home/Landing)
│   │   ├── 📄 globals.css                (Estilos globais)
│   │   │
│   │   ├── 📂 api/
│   │   │   ├── 📂 categorias/
│   │   │   │   ├── route.ts              (GET all, POST - criar)
│   │   │   │   └── [id]/route.ts         (GET by id, PUT, DELETE)
│   │   │   │
│   │   │   ├── 📂 produtos/              (A implementar)
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/route.ts
│   │   │   │
│   │   │   ├── 📂 vendas/                (A implementar)
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/route.ts
│   │   │   │
│   │   │   └── 📂 auth/                  (A implementar)
│   │   │       ├── route.ts
│   │   │       └── [id]/route.ts
│   │   │
│   │   ├── 📂 dashboard/
│   │   │   └── page.tsx                  (Dashboard shell)
│   │   │
│   │   ├── 📂 produtos/
│   │   │   └── page.tsx                  (Produtos shell)
│   │   │
│   │   └── 📂 vendas/
│   │       └── page.tsx                  (Vendas shell)
│   │
│   ├── 📂 components/                    (Componentes reutilizáveis)
│   │   ├── Navbar.tsx                    (Navegação)
│   │   ├── AlertStockBaixo.tsx           (Alerta visual)
│   │   ├── LoadingSpinner.tsx            (Spinner)
│   │   ├── Toast.tsx                     (Notificações)
│   │   │
│   │   ├── 📂 Produtos/                  (A criar)
│   │   │   ├── CardProduto.tsx
│   │   │   ├── FormProduto.tsx
│   │   │   └── ListaProdutos.tsx
│   │   │
│   │   ├── 📂 Vendas/                    (A criar)
│   │   │   ├── CardVenda.tsx
│   │   │   ├── FormVenda.tsx
│   │   │   └── ListaProdutosVenda.tsx
│   │   │
│   │   └── 📂 Dashboard/                 (A criar)
│   │       ├── CardMetrica.tsx
│   │       ├── GraficoVendas.tsx
│   │       └── ProdutosBaixos.tsx
│   │
│   └── 📂 lib/
│       ├── prisma.ts                     (Instância Prisma)
│       └── utils.ts                      (Funções utilitárias)
│
├── 📂 prisma/
│   ├── schema.prisma                     (⭐ Modelo de dados)
│   └── migrations/                       (Migrações - criadas automaticamente)
│
└── 📂 public/
    └── (assets estáticos)

```

---

## 📋 Ficheiros Importantes Por Função

### 🚀 Iniciar Projeto
1. `GUIA_COMECO.md` - Leia primeiro
2. `.env.example` - Copia para `.env`
3. `package.json` - Instala com `npm install`

### 📊 Entender Arquitetura
1. `PLANO_CONSTRUCAO.md` - Visão geral do projeto
2. `STATUS.md` - Status atual de implementação
3. `prisma/schema.prisma` - Modelo de dados

### 💻 Desenvolver
1. `src/app/api/categorias/route.ts` - Exemplo de rota
2. `src/app/api/categorias/[id]/route.ts` - Exemplo de rota dinâmica
3. `src/lib/utils.ts` - Função utilitárias
4. `src/components/` - Componentes prontos para usar

### 🎨 Frontend
1. `src/app/page.tsx` - Home
2. `src/app/dashboard/page.tsx` - Dashboard (em desenvolvimento)
3. `src/app/produtos/page.tsx` - Produtos (em desenvolvimento)
4. `src/app/vendas/page.tsx` - Vendas (em desenvolvimento)

### 🎯 Configuração
1. `tsconfig.json` - TypeScript
2. `tailwind.config.js` - Tailwind CSS
3. `next.config.js` - Next.js
4. `postcss.config.js` - PostCSS

---

## 🔄 Fluxo de Desenvolvimento

```
1. Ler GUIA_COMECO.md
   ↓
2. npm install && configurar .env
   ↓
3. npx prisma migrate dev
   ↓
4. npm run dev (testa estrutura)
   ↓
5. Estudar exemplo em /api/categorias/
   ↓
6. Implementar /api/produtos/ (seguindo padrão)
   ↓
7. Implementar /api/vendas/ (com lógica especial)
   ↓
8. Frontend para Dashboard
   ↓
9. Frontend para Produtos
   ↓
10. Frontend para Vendas
```

---

## 📝 Descrição dos Ficheiros

### Raiz
| Ficheiro | Propósito |
|----------|-----------|
| `package.json` | Dependências NPM e scripts |
| `tsconfig.json` | Configuração do compilador TypeScript |
| `next.config.js` | Configuração do Next.js |
| `tailwind.config.js` | Configuração do Tailwind CSS |
| `postcss.config.js` | Plugins PostCSS (Tailwind, Autoprefixer) |
| `.env.example` | Variáveis de ambiente (template) |
| `.gitignore` | Ficheiros a ignorar no Git |

### Documentação
| Ficheiro | Propósito |
|----------|-----------|
| `GUIA_COMECO.md` | ⭐ Passo a passo para começar |
| `PLANO_CONSTRUCAO.md` | Plano de execução detalhado |
| `README_SETUP.md` | Documentação completa do projeto |
| `STATUS.md` | Status de implementação |
| `ESTRUTURA.md` | Este ficheiro - mapa de ficheiros |

### Aplicação (`src/`)
| Ficheiro | Propósito |
|----------|-----------|
| `app/layout.tsx` | Layout HTML raiz |
| `app/globals.css` | Estilos globais (Tailwind) |
| `app/page.tsx` | Página inicial |
| `app/dashboard/page.tsx` | Página de dashboard |
| `app/produtos/page.tsx` | Página de produtos |
| `app/vendas/page.tsx` | Página de vendas |

### API Routes (`src/app/api/`)
| Ficheiro | Funcionalidade |
|----------|-----------|
| `categorias/route.ts` | GET & POST categor┌as |
| `categorias/[id]/route.ts` | GET, PUT & DELETE categoria específica |
| `produtos/route.ts` | (A fazer) Listagem e criar |
| `produtos/[id]/route.ts` | (A fazer) Detalhes, atualizar, deletar |
| `vendas/route.ts` | (A fazer) Listagem e criar |
| `vendas/[id]/route.ts` | (A fazer) Detalhes, atualizar, deletar |

### Componentes (`src/components/`)
| Ficheiro | Propósito |
|----------|-----------|
| `Navbar.tsx` | Barra de navegação |
| `AlertStockBaixo.tsx` | Alerta visual de stock |
| `LoadingSpinner.tsx` | Spinner de carregamento |
| `Toast.tsx` | Notificações flutuantes |

### Biblioteca (`src/lib/`)
| Ficheiro | Propósito |
|----------|-----------|
| `prisma.ts` | Instância singleton do Prisma Client |
| `utils.ts` | Funções utilitárias (formatação, cálculos) |

### Prisma (`prisma/`)
| Ficheiro | Propósito |
|----------|-----------|
| `schema.prisma` | ⭐ Definição do banco de dados e modelos |
| `migrations/` | Histórico de mudanças no esquema |

---

## 🎯 Para Cada Etapa do Desenvolvimento

### **Etapa 1: SETUP (Hoje)**
Ficheiros a consultar:
- ✅ `GUIA_COMECO.md`
- ✅ `package.json` (dependencies)

### **Etapa 2: BACKEND - Categorias**
Ficheiros a consultar:
- ✅ `src/app/api/categorias/` (usar como exemplo)
- ✅ `prisma/schema.prisma` (modelo)
- ✅ `src/lib/utils.ts` (utilitários)

### **Etapa 3: BACKEND - Produtos**
Ficheiros a criar/editar:
- 📝 `src/app/api/produtos/route.ts`
- 📝 `src/app/api/produtos/[id]/route.ts`
- 📝 Seguir padrão de `/categorias/`

### **Etapa 4: BACKEND - Vendas**
Ficheiros a criar/editar:
- 📝 `src/app/api/vendas/route.ts`
- 📝 `src/app/api/vendas/[id]/route.ts`
- 📝 Lógica especial de stock e lucro

### **Etapa 5: FRONTEND - Componentes**
Ficheiros a criar:
- 📝 `src/components/Produtos/` (vários)
- 📝 `src/components/Vendas/` (vários)
- 📝 `src/components/Dashboard/` (vários)

### **Etapa 6: FRONTEND - Páginas**
Ficheiros a editar:
- 📝 `src/app/dashboard/page.tsx`
- 📝 `src/app/produtos/page.tsx`
- 📝 `src/app/vendas/page.tsx`

---

## 📊 Estatísticas do Projeto

| Métrica | Count |
|---------|-------|
| Ficheiros criados | 30+ |
| Linhas de código | 1000+ |
| Componentes | 4 |
| Rotas API | 2 (exemplos) |
| Páginas | 4 |
| Estilos CSS | 500+ linhas |

---

## ✅ Pré-Checklist

Antes de começar a codificar:

- [ ] Leu `GUIA_COMECO.md`
- [ ] `.env` configurado
- [ ] `npm install` executado com sucesso
- [ ] `npx prisma migrate dev` completo
- [ ] `npm run dev` rodando sem erros
- [ ] http://localhost:3000 acessível
- [ ] `npx prisma studio` mostrando banco de dados

---

**Última Atualização:** 29 de Março de 2026
