# Sistema de Inventário e Vendas 📦

Um sistema web completo para gestão de inventário, categorias de produtos e registos de vendas com cálculo automático de lucros e alertas de stock baixo.

## 🚀 Quick Start

### Pré-requisitos
- Node.js 18+
- PostgreSQL 12+
- npm ou yarn

### Instalação

1. **Clone o repositório**
```bash
git clone <repo-url>
cd Sistema-de-Inventarios-e-Vendas
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o arquivo .env**
```bash
cp .env.example .env
```

Edite `.env` e configure a `DATABASE_URL`:
```
DATABASE_URL="postgresql://usuario:senha@localhost:5432/inventario_vendas"
```

4. **Configure o banco de dados**
```bash
npx prisma migrate dev
```

5. **Inicie o servidor**
```bash
npm run dev
```

A aplicação estará disponível em: http://localhost:3000

---

## 📋 Funcionalidades

✅ **Gestão de Produtos**
- Criar, editar e deletar produtos
- Associar a categorias
- Controlar preço, custo e stock

✅ **Gestão de Categorias**
- Organizar produtos por categorias
- Adicionar descrições

✅ **Registos de Vendas**
- Registar vendas com múltiplos itens
- Cálculo automático de lucro
- Diminuição automática de stock

✅ **Alertas**
- Produtos com stock baixo aparecem em vermelho
- Notificações de falta de stock

✅ **Dashboard**
- Visualização de total de vendas
- Total de lucros
- Número de produtos
- Produtos com stock crítico

---

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── api/                 # Backend API Routes
│   ├── dashboard/           # Página Dashboard
│   ├── produtos/            # Página de Produtos
│   ├── vendas/              # Página de Vendas
│   ├── layout.tsx           # Layout principal
│   └── page.tsx             # Página inicial
├── components/              # Componentes reutilizáveis
├── lib/                     # Funções utilitárias
└── globals.css              # Estilos globais

prisma/
└── schema.prisma            # Definição do banco de dados
```

---

## 🗄️ Modelo de Dados

### Tabelas

**Utilizador**
- id, email, nome, senha, criadorEm, atualizadoEm

**Categoria**
- id, nome, descricao, criadorEm, atualizadoEm

**Produto**
- id, nome, descricao, preco, custo, quantidade, quantidadeMinima, categoriaId, ativo, criadorEm, atualizadoEm

**Venda**
- id, dataVenda, total, lucroTotal, utilizadorId, observacoes, criadorEm, atualizadoEm

**ItemVenda**
- id, quantidade, precoUnitario, subtotal, lucroUnitario, vendaId, produtoId, criadorEm

---

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
npm run dev                  # Iniciar servidor em desenvolvimento
npx prisma studio          # Abrir interface visual do banco de dados
npm run lint                # Verificar código

# Build e Deploy
npm run build               # Compilar para produção
npm start                   # Iniciar servidor de produção

# Banco de Dados
npx prisma migrate dev      # Executar nova migração
npx prisma generate        # Gerar cliente Prisma
npx prisma reset           # Resetar banco de dados

# Testes
npm test                    # Executar testes (quando implementado)
```

---

## 🎨 Stack Tecnológico

- **Frontend:** React 18, Next.js 14, Tailwind CSS, Lucide Icons
- **Backend:** Next.js API Routes
- **Banco de Dados:** PostgreSQL com Prisma ORM
- **Linguagem:** TypeScript
- **Validação:** (A implementar)

---

## 📊 Plano de Desenvolvimento

Veja `PLANO_CONSTRUCAO.md` para o plano detalhado de execução com:
- Fases de desenvolvimento
- Checklist de tarefas
- Timings esperados
- Pontos de atenção

---

## 🐛 Troubleshooting

### Erro de conexão com banco de dados
```
Verifique se PostgreSQL está rodando
Confirme DATABASE_URL em .env está correta
Execute: npx prisma migrate dev
```

### Porta 3000 já em uso
```bash
npm run dev -- -p 3001  # Use outra porta
```

### Cache do Prisma desatualizado
```bash
npx prisma generate
rm -rf node_modules/.prisma
npm install
```

---

## 📝 Notas Importantes

- Sempre validar stock antes de vender
- Lucro é calculado como: (preço - custo) × quantidade
- Stock mínimo pode ser configurado por produto
- Todas as datas são armazenadas em UTC
- Usar HTTPS em produção

---

## 📄 Licença

Este projeto está sob licença [ADICIONAR LICENÇA]

---

## 👤 Autor

Collins SoftNet

---

## 🙋 Suporte

Para dúvidas ou problemas, abra uma issue no repositório.

---

**Última atualização:** 29 de Março de 2026
