# Paginação

Os métodos `search()` do SDK retornam resultados paginados para lidar com grandes volumes de dados.

## Estrutura de Resposta Paginada

```typescript
interface PaginatedResponse {
  pagina: number;              // Página atual
  numero_paginas: number;      // Total de páginas disponíveis
  // ... dados específicos (produtos, contatos, etc.)
}
```

## Busca Simples (Uma Página)

```typescript
const result = await sdk.product.search('notebook', { pagina: 1 });

console.log(`Página ${result.pagina} de ${result.numero_paginas}`);
console.log(`Produtos nesta página: ${result.produtos.length}`);
```

## Iterar Por Todas as Páginas

### Método 1: For Loop

```typescript
async function fetchAllProducts(searchTerm: string) {
  const allProducts = [];

  // Primeira página para saber o total
  const firstPage = await sdk.product.search(searchTerm, { pagina: 1 });
  allProducts.push(...firstPage.produtos);

  console.log(`Total de páginas: ${firstPage.numero_paginas}`);

  // Buscar páginas restantes
  for (let pagina = 2; pagina <= firstPage.numero_paginas; pagina++) {
    const page = await sdk.product.search(searchTerm, { pagina });
    allProducts.push(...page.produtos);
    console.log(`Página ${pagina}/${firstPage.numero_paginas} carregada`);
  }

  return allProducts;
}

const todos = await fetchAllProducts('notebook');
console.log(`Total de produtos: ${todos.length}`);
```

### Método 2: While Loop

```typescript
async function getAllContacts(searchTerm: string) {
  const allContacts = [];
  let currentPage = 1;
  let totalPages = 1;

  while (currentPage <= totalPages) {
    const result = await sdk.contact.search(searchTerm, { pagina: currentPage });

    allContacts.push(...result.contatos);
    totalPages = result.numero_paginas;

    console.log(`Carregado ${allContacts.length} contatos até agora...`);
    currentPage++;
  }

  return allContacts;
}
```

## Paginação com Progresso

```typescript
async function fetchWithProgress(searchTerm: string) {
  const products = [];
  const firstPage = await sdk.product.search(searchTerm, { pagina: 1 });

  products.push(...firstPage.produtos);
  const totalPages = firstPage.numero_paginas;

  console.log(`📦 Total de ${totalPages} páginas para carregar`);

  for (let page = 2; page <= totalPages; page++) {
    const result = await sdk.product.search(searchTerm, { pagina: page });
    products.push(...result.produtos);

    const progress = ((page / totalPages) * 100).toFixed(1);
    console.log(`⏳ Progresso: ${progress}% (${page}/${totalPages})`);
  }

  console.log(`✅ Total de ${products.length} produtos carregados`);
  return products;
}
```

## Paginação com Rate Limiting

```typescript
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchAllWithDelay(searchTerm: string, delayMs: number = 500) {
  const products = [];
  let currentPage = 1;
  let totalPages = 1;

  while (currentPage <= totalPages) {
    const result = await sdk.product.search(searchTerm, { pagina: currentPage });

    products.push(...result.produtos);
    totalPages = result.numero_paginas;

    console.log(`Página ${currentPage}/${totalPages} carregada`);

    // Aguardar antes da próxima requisição (exceto na última)
    if (currentPage < totalPages) {
      await delay(delayMs);
    }

    currentPage++;
  }

  return products;
}

// Uso: aguarda 500ms entre cada página
const products = await fetchAllWithDelay('mouse', 500);
```

## Paginação Paralela (Use com Cuidado!)

::: warning Atenção
Requisições paralelas podem sobrecarregar a API. Use apenas se necessário e com limite de concorrência.
:::

```typescript
async function fetchAllParallel(searchTerm: string, maxConcurrent: number = 3) {
  // Primeira página para saber o total
  const firstPage = await sdk.product.search(searchTerm, { pagina: 1 });
  const totalPages = firstPage.numero_paginas;

  const allProducts = [...firstPage.produtos];

  // Páginas restantes
  const remainingPages = Array.from(
    { length: totalPages - 1 },
    (_, i) => i + 2
  );

  // Processar em lotes de maxConcurrent
  for (let i = 0; i < remainingPages.length; i += maxConcurrent) {
    const batch = remainingPages.slice(i, i + maxConcurrent);

    const promises = batch.map(page =>
      sdk.product.search(searchTerm, { pagina: page })
    );

    const results = await Promise.all(promises);
    results.forEach(result => allProducts.push(...result.produtos));

    console.log(`Carregadas páginas ${batch.join(', ')}`);
  }

  return allProducts;
}

// Busca 3 páginas por vez
const products = await fetchAllParallel('notebook', 3);
```

## Generator para Paginação Lazy

```typescript
async function* paginateProducts(searchTerm: string) {
  let currentPage = 1;
  let totalPages = 1;

  while (currentPage <= totalPages) {
    const result = await sdk.product.search(searchTerm, { pagina: currentPage });

    totalPages = result.numero_paginas;

    yield {
      pagina: currentPage,
      totalPaginas: totalPages,
      produtos: result.produtos
    };

    currentPage++;
  }
}

// Uso
for await (const page of paginateProducts('mouse')) {
  console.log(`Página ${page.pagina}/${page.totalPaginas}: ${page.produtos.length} produtos`);

  // Processar produtos da página
  page.produtos.forEach(p => {
    console.log(`  - ${p.nome}`);
  });
}
```

## Busca com Cursor/Offset (Simulado)

```typescript
class PaginatedSearch {
  private currentPage = 1;
  private totalPages = 1;
  private searchTerm: string;

  constructor(searchTerm: string) {
    this.searchTerm = searchTerm;
  }

  async next() {
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      return null;
    }

    const result = await sdk.product.search(this.searchTerm, {
      pagina: this.currentPage
    });

    this.totalPages = result.numero_paginas;
    this.currentPage++;

    return {
      produtos: result.produtos,
      hasMore: this.currentPage <= this.totalPages,
      currentPage: this.currentPage - 1,
      totalPages: this.totalPages
    };
  }

  async *[Symbol.asyncIterator]() {
    while (this.currentPage <= this.totalPages || this.totalPages === 0) {
      const page = await this.next();
      if (!page) break;
      yield page;
    }
  }
}

// Uso
const search = new PaginatedSearch('notebook');

// Página por página
const page1 = await search.next();
const page2 = await search.next();

// Ou iterar
for await (const page of new PaginatedSearch('mouse')) {
  console.log(`Página ${page.currentPage}: ${page.produtos.length} produtos`);
  if (!page.hasMore) break;
}
```

## Exportação com Paginação

```typescript
import fs from 'fs';

async function exportAllProductsToCSV(filename: string) {
  const writeStream = fs.createWriteStream(filename);

  // Header CSV
  writeStream.write('ID,Nome,SKU,Preço,Estoque\n');

  let currentPage = 1;
  let totalPages = 1;
  let totalExported = 0;

  while (currentPage <= totalPages) {
    const result = await sdk.product.search('', { pagina: currentPage });
    totalPages = result.numero_paginas;

    // Escrever produtos no CSV
    result.produtos.forEach(p => {
      const line = `${p.id},"${p.nome}","${p.codigo}",${p.preco},${p.estoque_atual}\n`;
      writeStream.write(line);
      totalExported++;
    });

    console.log(`Página ${currentPage}/${totalPages} exportada`);
    currentPage++;
  }

  writeStream.end();
  console.log(`✅ ${totalExported} produtos exportados para ${filename}`);
}

await exportAllProductsToCSV('produtos.csv');
```

## Melhores Práticas

1. **Sempre use delay entre páginas** para não sobrecarregar a API
2. **Mostre progresso** para o usuário em operações longas
3. **Capture erros** em cada página individualmente
4. **Considere usar generators** para grandes volumes de dados
5. **Evite carregar tudo na memória** se possível

## Próximos Passos

- [Aprender sobre operações em lote](/guides/batch-operations)
- [Ver tratamento de erros](/guides/error-handling)
- [Consultar API Reference](/api/)
