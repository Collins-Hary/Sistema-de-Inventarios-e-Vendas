# 🚀 GUIA DE COMEÇAR - Sistema de Inventário e Vendas

## ✅ Checklist Inicial

### 1️⃣ Preparar o Ambiente

- [ ] **PostgreSQL Instalado e Rodando**
  ```bash
  # Windows (com PostgreSQL instalado)
  # Abrir Services e verificar se PostgreSQL está ativo
  
  # Linux/Mac
  brew services start postgresql
  ```

- [ ] **Node.js 18+ Instalado**
  ```bash
  node --version  # Deve mostrar v18.0.0 ou superior
  ```

### 2️⃣ Configurar o Projeto

```bash
# Navegar para o diretório do projeto
cd "c:\Users\cleus\Desktop\Collins SoftNet\Sistema-de-Inventarios-e-Vendas"

# Instalar dependências
npm install

# Copiar arquivo de ambiente
copy .env.example .env
```

### 3️⃣ Configurar Banco de Dados

**Editar arquivo `.env`:**
```
DATABASE_URL="postgresql://seu_usuario:sua_senha@localhost:5432/inventario_vendas"
```

**Exemplo com PostgreSQL padrão:**
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/inventario_vendas"
```

### 4️⃣ Criar Banco de Dados e Executar Migrações

```bash
# Executar migração (cria banco e tabelas)
npx prisma migrate dev --name init

# Você será perguntado se quer gerar o Prisma Client
# Digite: yes
```

### 5️⃣ Iniciar o Servidor

```bash
npm run dev
```

Acesse: **http://localhost:3000** 🎉

---

## 📖 Próximos Passos

### Para Explorar o Banco de Dados

```bash
# Abrir interface visual do Prisma
npx prisma studio
```

Acesse: **http://localhost:5555**

### Para Começar a Desenvolver

1. **API de Categorias** (já tem exemplo em `/src/app/api/categorias/`)
   - Teste com: POST http://localhost:3000/api/categorias
   - Body: `{"nome": "Eletrônicos", "descricao": "Produtos eletrônicos"}`

2. **Próximas Implementações:**
   - CRUD de Produtos
   - CRUD de Vendas
   - Frontend de Dashboard

---

## 🔍 Troubleshooting Rápido

### ❌ "connection refused"
**Solução:** PostgreSQL não está rodando
```bash
# Windows
# Abrir Services (services.msc) e verificar se "postgresql-x64-14" está ativo

# Linux
sudo service postgresql start

# Mac
brew services start postgresql
```

### ❌ "database does not exist"
**Solução:** Executar migração
```bash
npx prisma migrate dev
```

### ❌ "Porta 3000 já em uso"
**Solução:** Usar outra porta
```bash
npm run dev -- -p 3001
```

### ❌ Erros no `.env`
**Solução:** Verificar formato
```
# ✅ Correto
DATABASE_URL="postgresql://user:pass@localhost:5432/dbname"

# ❌ Errado (faltam aspas)
DATABASE_URL=postgresql://user:pass@localhost:5432/dbname
```

---

## 🎯 Fase 1 Concluída ✅

Parabéns! Você tem:
- ✅ Estrutura de pastas configurada
- ✅ Prisma ORM pronto
- ✅ Banco de dados esquematizado
- ✅ App Next.js rodando
- ✅ Exemplo de API implementada

---

## 📚 Referências Úteis

- [Documentação Next.js 14](https://nextjs.org/docs)
- [Documentação Prisma](https://www.prisma.io/docs/)
- [Documentação Tailwind CSS](https://tailwindcss.com/docs)

---

**Próximo:** Seguir o plano em `PLANO_CONSTRUCAO.md` para implementar as funcionalidades
