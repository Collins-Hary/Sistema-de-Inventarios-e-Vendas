# 🔌 REFERÊNCIA DE API - Endpoints e Exemplos

## 📋 Sumário de Endpoints

```
CATEGORIAS
├── GET    /api/categorias              → Listar todas
├── POST   /api/categorias              → Criar nova
├── GET    /api/categorias/[id]         → Detalhe
├── PUT    /api/categorias/[id]         → Atualizar
└── DELETE /api/categorias/[id]         → Deletar

PRODUTOS (A IMPLEMENTAR)
├── GET    /api/produtos                → Listar todas
├── POST   /api/produtos                → Criar novo
├── GET    /api/produtos/[id]           → Detalhe
├── PUT    /api/produtos/[id]           → Atualizar
└── DELETE /api/produtos/[id]           → Deletar

VENDAS (A IMPLEMENTAR)
├── GET    /api/vendas                  → Listar todas
├── POST   /api/vendas                  → Criar nova
├── GET    /api/vendas/[id]             → Detalhe
├── PUT    /api/vendas/[id]             → Atualizar
└── DELETE /api/vendas/[id]             → Deletar

AUTH (A IMPLEMENTAR)
├── POST   /api/auth/login              → Login
├── POST   /api/auth/register           → Registo
└── POST   /api/auth/logout             → Logout
```

---

## 🟢 CATEGORIAS (Implementado)

### 1. Listar Todas as Categorias
```http
GET /api/categorias
Content-Type: application/json
```

**Resposta (200):**
```json
[
  {
    "id": 1,
    "nome": "Eletrônicos",
    "descricao": "Produtos eletrônicos",
    "criadorEm": "2026-03-29T10:00:00Z",
    "atualizadoEm": "2026-03-29T10:00:00Z",
    "produtos": []
  }
]
```

---

### 2. Criar Nova Categoria
```http
POST /api/categorias
Content-Type: application/json

{
  "nome": "Eletrônicos",
  "descricao": "Produtos eletrônicos"
}
```

**Resposta (201):**
```json
{
  "id": 1,
  "nome": "Eletrônicos",
  "descricao": "Produtos eletrônicos",
  "criadorEm": "2026-03-29T10:00:00Z",
  "atualizadoEm": "2026-03-29T10:00:00Z"
}
```

**Erros:**
- **400:** Nome vazio
- **409:** Categoria já existe
- **500:** Erro no servidor

---

### 3. Obter Detalhes de Categoria
```http
GET /api/categorias/1
Content-Type: application/json
```

**Resposta (200):**
```json
{
  "id": 1,
  "nome": "Eletrônicos",
  "descricao": "Produtos eletrônicos",
  "criadorEm": "2026-03-29T10:00:00Z",
  "atualizadoEm": "2026-03-29T10:00:00Z",
  "produtos": [
    {
      "id": 1,
      "nome": "Monitor",
      "preco": 150.00,
      "quantidade": 5
    }
  ]
}
```

**Erros:**
- **404:** Categoria não encontrada
- **500:** Erro no servidor

---

### 4. Atualizar Categoria
```http
PUT /api/categorias/1
Content-Type: application/json

{
  "nome": "Eletrônicos Novos",
  "descricao": "Eletrônicos atualizados"
}
```

**Resposta (200):**
```json
{
  "id": 1,
  "nome": "Eletrônicos Novos",
  "descricao": "Eletrônicos atualizados",
  "criadorEm": "2026-03-29T10:00:00Z",
  "atualizadoEm": "2026-03-29T11:00:00Z"
}
```

**Erros:**
- **404:** Categoria não encontrada
- **500:** Erro no servidor

---

### 5. Deletar Categoria
```http
DELETE /api/categorias/1
```

**Resposta (200):**
```json
{
  "mensagem": "Categoria deletada com sucesso"
}
```

**Erros:**
- **404:** Categoria não encontrada
- **500:** Erro no servidor (ex: categoria tem produtos)

---

## 🔴 PRODUTOS (A IMPLEMENTAR)

### Template de Implementação

Seguir o padrão de **CATEGORIAS** com estas diferenças:

**Tabela Produto:**
```typescript
{
  id: number
  nome: string
  descricao?: string
  preco: number
  custo: number
  quantidade: number
  quantidadeMinima: number
  categoriaId: number
  ativo: boolean
  criadorEm: DateTime
  atualizadoEm: DateTime
}
```

**Validações Especiais:**
- Validar se categoria existe (ao criar)
- `preco > custo` (deve ter margem)
- `quantidade >= 0`
- `quantidadeMinima >= 0`

**Endpoints:**
```http
GET    /api/produtos
POST   /api/produtos
GET    /api/produtos/[id]
PUT    /api/produtos/[id]
DELETE /api/produtos/[id]
```

**Query Parameters Opcionais:**
```http
GET /api/produtos?categoria=1&ativo=true&sort=nome
```

---

## 🟠 VENDAS (A IMPLEMENTAR)

### Template de Implementação

**Tabela Venda:**
```typescript
{
  id: number
  dataVenda: DateTime
  total: number
  lucroTotal: number
  utilizadorId: number
  observacoes?: string
  criadorEm: DateTime
  atualizadoEm: DateTime
}
```

**Tabela ItemVenda:**
```typescript
{
  id: number
  quantidade: number
  precoUnitario: number
  subtotal: number
  lucroUnitario: number
  vendaId: number
  produtoId: number
  criadorEm: DateTime
}
```

**Endpoints:**
```http
GET    /api/vendas
POST   /api/vendas
GET    /api/vendas/[id]
PUT    /api/vendas/[id]
DELETE /api/vendas/[id]
```

**POST /api/vendas - Corpo Esperado:**
```json
{
  "utilizadorId": 1,
  "observacoes": "Venda do dia",
  "itens": [
    {
      "produtoId": 1,
      "quantidade": 2,
      "precoUnitario": 100.00
    },
    {
      "produtoId": 2,
      "quantidade": 1,
      "precoUnitario": 50.00
    }
  ]
}
```

**Lógica Especial:**
1. Validar stock disponível para cada produto
2. Calcular `subtotal = quantidade × precoUnitario`
3. Calcular `lucroUnitario = (precoUnitario - custoProduto) × quantidade`
4. Calcular `total = SUM(subtotal)`
5. Calcular `lucroTotal = SUM(lucroUnitario)`
6. Diminuir stock: `produto.quantidade -= quantidade`
7. Criar registos em `Venda` e `ItemVenda`

**Respostas:**
- **201:** Venda criada com sucesso
- **400:** Dados inválidos ou stock insuficiente
- **500:** Erro no servidor

---

## 🟡 AUTH (A IMPLEMENTAR)

### Endpoints Básicos

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh
```

### Tabela Utilizador
```typescript
{
  id: number
  email: string (único)
  nome: string
  senha: string (hashed - bcrypt)
  criadorEm: DateTime
  atualizadoEm: DateTime
}
```

---

## 🛠️ Códigos de Status HTTP

| Código | Significado | Exemplo |
|--------|-------------|---------|
| **200** | OK | GET com sucesso |
| **201** | Created | POST com sucesso |
| **400** | Bad Request | Dados inválidos |
| **404** | Not Found | Recurso não existe |
| **409** | Conflict | Duplicado/Violação de constraints |
| **500** | Server Error | Erro não esperado |

---

## 📝 Exemplo de Uso no Frontend

```typescript
// Listar categorias
const response = await fetch('/api/categorias');
const categorias = await response.json();

// Criar categoria
const response = await fetch('/api/categorias', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    nome: 'Eletrônicos',
    descricao: 'Produtos eletrônicos'
  })
});
const novaCategoria = await response.json();

// Atualizar categoria
const response = await fetch('/api/categorias/1', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    nome: 'Eletrônicos Premium'
  })
});

// Deletar categoria
const response = await fetch('/api/categorias/1', {
  method: 'DELETE'
});
```

---

## 🧪 Testar com Postman/Insomnia

1. Importar ficheiro (se criado): `Sistema-de-Inventarios-e-Vendas.postman_collection.json`
2. Ou criar manualmente:
   - **GET** http://localhost:3000/api/categorias
   - **POST** http://localhost:3000/api/categorias
   - Body: `{"nome": "Teste", "descricao": "Teste"}`

---

## 📚 Referências

- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- [REST API Best Practices](https://restfulapi.net/)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

---

**Última Atualização:** 29 de Março de 2026
