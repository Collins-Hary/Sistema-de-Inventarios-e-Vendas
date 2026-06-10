# 📋 PLANO DE CONSTRUÇÃO - SISTEMA DE INVENTÁRIO E VENDAS

## 🎯 Objetivo
Resolver problema de controlo manual de stock com sistema integrado de inventário e vendas.

---

## 🔧 Funcionalidades (MVP)
✅ Cadastro de produtos  
✅ Gestão de categorias  
✅ Registo de vendas  
✅ Cálculo automático de lucro  
✅ Alertas de stock baixo  

---

## 🧩 Estrutura do Projeto

```
src/
├── app/
│   ├── api/
│   │   ├── produtos/
│   │   ├── vendas/
│   │   ├── categorias/
│   │   └── auth/
│   ├── dashboard/
│   ├── produtos/
│   ├── vendas/
│   └── page.tsx
├── components/
│   ├── Navbar.tsx
│   ├── Sidebar.tsx
│   ├── FormProduto.tsx
│   ├── FormVenda.tsx
│   ├── CardProduto.tsx
│   └── AlertStockBaixo.tsx
├── lib/
│   ├── prisma.ts
│   └── utils.ts
└── globals.css

prisma/
└── schema.prisma

public/
```

---

## 📊 Modelo de Dados

| Tabela | Campos |
|--------|--------|
| **Utilizador** | id, email, nome, senha, criadorEm, atualizadoEm |
| **Categoria** | id, nome, descricao, criadorEm, atualizadoEm |
| **Produto** | id, nome, descricao, preco, custo, quantidade, quantidadeMinima, categoriaId, ativo, criadorEm, atualizadoEm |
| **Venda** | id, dataVenda, total, lucroTotal, utilizadorId, observacoes, criadorEm, atualizadoEm |
| **ItemVenda** | id, quantidade, precoUnitario, subtotal, lucroUnitario, vendaId, produtoId, criadorEm |

---

## ⏱️ ETAPAS DE EXECUÇÃO

### **FASE 1: Modelação (1–2 dias)**
**Tarefas:**
- [x] Criar schema Prisma com todas as tabelas
- [ ] Criar arquivo .env com DATABASE_URL
- [ ] Executar `npx prisma migrate dev` para criar banco de dados
- [ ] Gerar cliente Prisma com `npx prisma generate`

**Checklist:**
- Schema completo e validado
- Banco de dados criado
- Relacionamentos funcionais

---

### **FASE 2: Backend (4–5 dias)**

#### **Dia 1-2: Setup e Autenticação**
- [ ] Criar rota de autenticação (`/api/auth/login`, `/api/auth/register`)
- [ ] Implementar middleware de autenticação
- [ ] Criar função de hashing de password

#### **Dia 2-3: CRUD Categorias**
- [ ] GET `/api/categorias` - Listar todas
- [ ] POST `/api/categorias` - Criar nova
- [ ] PUT `/api/categorias/[id]` - Atualizar
- [ ] DELETE `/api/categorias/[id]` - Deletar

#### **Dia 3-4: CRUD Produtos**
- [ ] GET `/api/produtos` - Listar todas
- [ ] GET `/api/produtos/[id]` - Detalhe
- [ ] POST `/api/produtos` - Criar nova
- [ ] PUT `/api/produtos/[id]` - Atualizar
- [ ] DELETE `/api/produtos/[id]` - Deletar

**Lógica Especial:**
- Validar stock mínimo
- Calcular lucro por produto (preco - custo)

#### **Dia 4-5: CRUD Vendas**
- [ ] GET `/api/vendas` - Listar todas
- [ ] GET `/api/vendas/[id]` - Detalhe
- [ ] POST `/api/vendas` - Criar nova venda
- [ ] PUT `/api/vendas/[id]` - Atualizar

**Lógica Especial:**
- Ao criar ItemVenda, diminuir stock do Produto
- Calcular lucro total por venda: SUM(lucroUnitario * quantidade)
- Validar disponibilidade de stock

#### **Dia 5: Utilitários**
- [ ] Criar função `calcularLucro(preco, custo, quantidade)`
- [ ] Criar função `verificarStockBaixo(quantidade, quantidadeMinima)`
- [ ] Criar função `formatarMoeda(valor)`

---

### **FASE 3: Frontend (4–5 dias)**

#### **Dia 1: Componentes Base**
- [ ] Navbar com navegação
- [ ] Sidebar com menu lateral
- [ ] Layout geral responsivo
- [ ] Componentes de botões e inputs

#### **Dia 2: Dashboard**
- [ ] Total de vendas (mês/ano)
- [ ] Total de lucro
- [ ] Número de produtos
- [ ] Card: Produtos com pouco stock (em vermelho)
- [ ] Gráfico de vendas (opcional: Chart.js)

#### **Dia 3: Página de Produtos**
- [ ] Tabela de produtos com filtro
- [ ] Buscar por categoria
- [ ] Buscar por nome
- [ ] Botão adicionar produto
- [ ] Modal/Formulário de criar/editar
- [ ] Indicador visual de stock baixo

#### **Dia 4: Página de Vendas**
- [ ] Tabela de vendas
- [ ] Filtro por data
- [ ] Buscar por utilizador
- [ ] Botão nova venda
- [ ] Modal/Formulário com:
  - Seleção de produtos
  - Quantidade
  - Cálculo automático de total e lucro
  - Confirmação

#### **Dia 5: Polish e Responsividade**
- [ ] Ajustar cores e espaçamento
- [ ] Mobile responsividade
- [ ] Mensagens de erro/sucesso
- [ ] Loading states

---

### **FASE 4: Diferencial (2 dias)**

#### **Dia 1: Sistema de Alerta**
- [x] Toast/Notificação: Stock < mínimo → Card vermelho no Dashboard
- [x] Email de alerta (opcional)
- [x] Badge na Navbar mostrando número de produtos com stock baixo

#### **Dia 2: Relatórios e Extras**
- [x] Exportar vendas para CSV
- [x] Gráfico de lucro por categoria
- [x] Histórico de movimentação de stock (API Base)
- [x] Auditoria (quem criou/alterou o quê) (API Base)

---

## 📋 Checklist Geral

### Antes de Iniciar
- [ ] Instalar Node.js e npm
- [ ] Clonar repositório
- [ ] Copiar `.env.example` para `.env`
- [ ] Configurar DATABASE_URL (PostgreSQL)

### Setup do Projeto
- [ ] `npm install`
- [ ] `npx prisma migrate dev`
- [ ] `npm run dev`

### Durante o Desenvolvimento
- [ ] Testar cada rota com Postman/Insomnia
- [ ] Validar dados no backend
- [ ] Testes manuais na interface
- [ ] Git commits regulares

### Antes do Deploy
- [ ] Todas as funcionalidades testadas
- [ ] Sem console.log em produção
- [ ] Variáveis de ambiente configuradas
- [ ] Build sem erros: `npm run build`

---

## 🚀 Comandos Úteis

```bash
# Setup inicial
npm install
cp .env.example .env
npx prisma migrate dev

# Desenvolvimento
npm run dev              # Iniciar servidor
npx prisma studio      # Interface visual do banco de dados
npm run lint            # Verificar código

# Build
npm run build
npm start

# Prisma
npx prisma migrate dev  # Nova migração
npx prisma generate    # Gerar cliente
npx prisma reset       # Resetar banco de dados
```

---

## 📈 Timings Esperados

| Fase | Duração |
|------|---------|
| Modelação | 1–2 dias |
| Backend | 4–5 dias |
| Frontend | 4–5 dias |
| Diferencial | 2 dias |
| **TOTAL** | **~11–14 dias** |

---

## 🎨 Stack Tecnológico

- **Frontend:** React 18, Next.js 14, Tailwind CSS
- **Backend:** Next.js API Routes
- **BD:** PostgreSQL com Prisma ORM
- **Autenticação:** JWT (adicionar depois)
- **Validação:** Zod ou Joi

---

## ⚠️ Pontos de Atenção

1. **Stock:** Sempre validar antes de vender
2. **Lucro:** Será calculado como (preço - custo) * quantidade
3. **Segurança:** Adicionar autenticação todas as rotas
4. **Performance:** Adicionar paginação em listagens
5. **Backup:** Fazer backup regular do banco de dados

---

## 📝 Notas Adicionais

- Estrutura de pastas já criada
- Schema Prisma pronto para usar
- Configuração Tailwind CSS incluída
- Arquivo `.env.example` fornecido

**Próximo passo:** Instalar dependências com `npm install` ✅
