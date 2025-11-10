# Products Resource

O resource `Products` permite gerenciar produtos no TinyERP, incluindo produtos simples, com variações e kits.

## Métodos Disponíveis

| Método | Descrição | Endpoint |
|--------|-----------|----------|
| `search()` | Pesquisar produtos | `POST /produtos.pesquisa.php` |
| `getById()` | Obter detalhes completos | `POST /produto.obter.php` |
| `create()` | Criar produtos em lote | `POST /produto.incluir.php` |

## search()

Pesquisa produtos com filtros avançados.

```typescript
search(pesquisa: string, options?: ProductsSearchOptions): Promise<PaginatedProductsResponse>
```

### Exemplos

```typescript
// Busca simples
const result = await sdk.product.search('notebook');
console.log(`Encontrados ${result.produtos.length} produtos`);

// Filtros avançados
const filtered = await sdk.product.search('mouse', {
  situacao: 'A',          // Apenas ativos
  pagina: 2,
  idListaPreco: 123,     // Lista de preços específica
  idTag: 456             // Tag específica
});

// Busca por GTIN/EAN
const byGtin = await sdk.product.search('', {
  gtin: '7891234567890'
});
```

## getById()

Obtém detalhes completos incluindo variações, kits, imagens, etc.

```typescript
getById(id: number): Promise<ProductDetails>
```

### Exemplo

```typescript
const product = await sdk.product.getById(12345);

console.log('Nome:', product.nome);
console.log('SKU:', product.codigo);
console.log('Preço:', product.preco);
console.log('Estoque:', product.estoque_atual);

// Variações
if (product.variacoes?.length > 0) {
  console.log('\nVariações:');
  product.variacoes.forEach(v => {
    console.log(`  ${v.codigo} - R$ ${v.preco}`);
    console.log(`    Grade:`, v.grade);  // Ex: { "Cor": "Azul", "Tamanho": "M" }
    console.log(`    Estoque: ${v.estoque_atual}`);
  });
}

// Kit
if (product.classe_produto === 'K' && product.kit) {
  console.log('\nItens do kit:');
  product.kit.forEach(item => {
    console.log(`  Produto ${item.id_produto}: ${item.quantidade}x`);
  });
}

// SEO
console.log('\nSEO:');
console.log('Title:', product.seo_title);
console.log('Description:', product.seo_description);
console.log('Slug:', product.slug);
```

## create()

Cria produtos em lote. Suporta produtos simples, com variações e kits.

```typescript
create(products: ProductCreateEntry[]): Promise<ProductCreateResultRecord[]>
```

### Exemplo - Produto Simples

```typescript
const result = await sdk.product.create([
  {
    sequencia: 1,
    data: {
      nome: 'Notebook Dell Inspiron 15',
      codigo: 'DELL-INS15',
      unidade: 'UN',
      preco: 3500.00,
      origem: '0',
      situacao: 'A',
      tipo: 'P',
      gtin: '7891234567890',
      ncm: '84713012',
      peso_bruto: 2.5,
      peso_liquido: 2.3,
      estoque_minimo: 5,
      estoque_atual: 20
    }
  }
]);

if (result[0].status === 'OK') {
  console.log('Produto criado! ID:', result[0].id);
}
```

### Exemplo - Produto com Variações

```typescript
const comVariacoes = await sdk.product.create([
  {
    sequencia: 1,
    data: {
      nome: 'Camiseta Básica',
      codigo: 'CAM-BASIC',
      unidade: 'UN',
      preco: 49.90,
      origem: '0',
      situacao: 'A',
      tipo: 'P',
      classe_produto: 'V',  // V = Com variações
      variacoes: [
        {
          codigo: 'CAM-AZUL-P',
          preco: 49.90,
          grade: { 'Cor': 'Azul', 'Tamanho': 'P' },
          estoque_atual: 10
        },
        {
          codigo: 'CAM-AZUL-M',
          preco: 49.90,
          grade: { 'Cor': 'Azul', 'Tamanho': 'M' },
          estoque_atual: 15
        },
        {
          codigo: 'CAM-VERM-P',
          preco: 54.90,
          grade: { 'Cor': 'Vermelho', 'Tamanho': 'P' },
          estoque_atual: 8
        }
      ]
    }
  }
]);
```

### Exemplo - Kit de Produtos

```typescript
const kit = await sdk.product.create([
  {
    sequencia: 1,
    data: {
      nome: 'Kit Escritório Completo',
      codigo: 'KIT-OFFICE',
      unidade: 'UN',
      preco: 4500.00,
      origem: '0',
      situacao: 'A',
      tipo: 'P',
      classe_produto: 'K',  // K = Kit
      kit: [
        { id_produto: 12345, quantidade: 1 },  // Notebook
        { id_produto: 12346, quantidade: 1 },  // Mouse
        { id_produto: 12347, quantidade: 1 },  // Teclado
        { id_produto: 12348, quantidade: 1 }   // Monitor
      ]
    }
  }
]);
```

### Exemplo - Criar em Lote

```typescript
const lote = await sdk.product.create([
  {
    sequencia: 1,
    data: { nome: 'Produto 1', unidade: 'UN', preco: 100, origem: '0', situacao: 'A', tipo: 'P' }
  },
  {
    sequencia: 2,
    data: { nome: 'Produto 2', unidade: 'UN', preco: 200, origem: '0', situacao: 'A', tipo: 'P' }
  },
  {
    sequencia: 3,
    data: { nome: 'Serviço 1', unidade: 'HR', preco: 150, origem: '0', situacao: 'A', tipo: 'S' }
  }
]);

const sucessos = lote.filter(r => r.status === 'OK');
console.log(`${sucessos.length} produtos criados`);
```

## Tipos de Produto

### Tipo (campo `tipo`)

- `"P"`: Produto
- `"S"`: Serviço

### Classe do Produto (campo `classe_produto`)

- `"S"`: Simples (padrão)
- `"V"`: Com variações
- `"K"`: Kit
- `"E"`: Com estrutura

### Situação

- `"A"`: Ativo
- `"I"`: Inativo
- `"E"`: Excluído

### Origem

- `"0"`: Nacional
- `"1"`: Estrangeira - Importação direta
- `"2"`: Estrangeira - Adquirida no mercado interno

## Campos de SEO e E-commerce

```typescript
{
  seo_title: 'Título para SEO',
  seo_description: 'Descrição para SEO',
  slug: 'produto-exemplo',
  link_video: 'https://youtube.com/...',
  mapeamentos: [
    {
      idEcommerce: 1,
      skuMapeamento: 'SKU-ECOMMERCE-123'
    }
  ]
}
```

## Imagens e Anexos

```typescript
{
  imagens_externas: [
    {
      url: 'https://example.com/produto.jpg'
    }
  ],
  anexos: [
    {
      anexo: 'base64_encoded_file_content'
    }
  ]
}
```

## Paginação

```typescript
let pagina = 1;
let hasMore = true;

while (hasMore) {
  const result = await sdk.product.search('', { pagina });

  console.log(`Página ${pagina}: ${result.produtos.length} produtos`);

  hasMore = pagina < result.numero_paginas;
  pagina++;
}
```

## Próximos Passos

- [Ver guia de operações em lote](/guides/batch-operations)
- [Aprender sobre paginação](/guides/pagination)
- [Consultar API Reference completa](/api/index)
