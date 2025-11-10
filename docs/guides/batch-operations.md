# Operações em Lote (Batch)

O SDK TinyERP suporta operações em lote para criar e atualizar múltiplos registros de uma vez. Como as requisições são feitas enviando os dados via params, existe um tamanho de dados para serem enviados.
**[O limite de requisições vai depender da sua conta no Tiny.](https://tiny.com.br/api-docs/api2-limites-api)**

## Por Que Usar Batch?

- ✅ **Performance**: Uma requisição para múltiplos registros
- ✅ **Eficiência**: Reduz overhead de rede
- ✅ **Controle**: Processamento individual de cada item
- ✅ **Atomicidade Parcial**: Alguns podem falhar, outros suceder

## Criar Contatos em Lote

```typescript
const contacts = await sdk.contact.create([
  {
    sequencia: 1,
    contato: {
      nome: "João Silva",
      tipo_pessoa: "F",
      cpf_cnpj: "11111111111",
      email: "joao@email.com",
    },
  },
  {
    sequencia: 2,
    contato: {
      nome: "Maria Santos",
      tipo_pessoa: "F",
      cpf_cnpj: "22222222222",
      email: "maria@email.com",
    },
  },
  {
    sequencia: 3,
    contato: {
      nome: "Empresa XYZ LTDA",
      tipo_pessoa: "J",
      cpf_cnpj: "12345678000199",
      email: "contato@xyz.com",
    },
  },
]);

// Processar resultados
const sucessos = contacts.filter((r) => r.status === "OK");
const erros = contacts.filter((r) => r.status === "Erro");

console.log(`✅ ${sucessos.length} criados`);
console.log(`❌ ${erros.length} com erro`);
```

## Criar Produtos em Lote

```typescript
const products = await sdk.product.create([
  {
    sequencia: 1,
    data: {
      nome: "Produto A",
      codigo: "PROD-A",
      unidade: "UN",
      preco: 100,
      origem: "0",
      situacao: "A",
      tipo: "P",
    },
  },
  {
    sequencia: 2,
    data: {
      nome: "Produto B",
      codigo: "PROD-B",
      unidade: "UN",
      preco: 200,
      origem: "0",
      situacao: "A",
      tipo: "P",
    },
  },
]);
```

## Processar Resultados

### Separar Sucessos e Erros

```typescript
const results = await sdk.contact.create([...]);

const sucessos = results.filter(r => r.status === 'OK');
const erros = results.filter(r => r.status === 'Erro');

console.log(`Processados: ${results.length}`);
console.log(`Sucessos: ${sucessos.length}`);
console.log(`Erros: ${erros.length}`);

// IDs dos registros criados
const ids = sucessos.map(r => r.id);
console.log('IDs criados:', ids);
```

### Exibir Erros Detalhados

```typescript
if (erros.length > 0) {
  console.error("\n❌ Erros encontrados:\n");

  erros.forEach((erro) => {
    console.error(`Sequência ${erro.sequencia}:`);

    if (erro.erros) {
      erro.erros.forEach((e) => {
        console.error(`  - ${e.erro}`);
      });
    }

    console.error("");
  });
}
```

### Mapear Resultados

```typescript
const resultMap = results.reduce((map, result) => {
  map[result.sequencia] = result;
  return map;
}, {} as Record<number, any>);

// Verificar resultado específico
if (resultMap[1].status === "OK") {
  console.log("Item 1 criado com ID:", resultMap[1].id);
}
```

## Chunking (Dividir em Lotes)

Para grandes volumes, divida em chunks menores:

```typescript
function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

async function createInChunks(contacts: any[], chunkSize: number = 10) {
  const chunks = chunk(contacts, chunkSize);
  const allResults = [];

  for (let i = 0; i < chunks.length; i++) {
    console.log(`Processando lote ${i + 1}/${chunks.length}...`);

    // Re-sequenciar cada chunk
    const chunkWithSequence = chunks[i].map((contact, index) => ({
      sequencia: index + 1,
      contato: contact
    }));

    const results = await sdk.contact.create(chunkWithSequence);
    allResults.push(...results);

    // Delay entre chunks
    if (i < chunks.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return allResults;
}

// Uso
const manyContacts = [...]; // 100 contatos
const results = await createInChunks(manyContacts, 10); // 10 por vez
```

## Retry de Itens Falhados

```typescript
async function createWithRetry(items: any[], maxRetries: number = 2) {
  let toCreate = items.map((item, index) => ({
    sequencia: index + 1,
    contato: item,
  }));

  let attempt = 0;
  const allSuccesses = [];

  while (toCreate.length > 0 && attempt < maxRetries) {
    attempt++;
    console.log(`\nTentativa ${attempt}: ${toCreate.length} itens`);

    const results = await sdk.contact.create(toCreate);

    const sucessos = results.filter((r) => r.status === "OK");
    const erros = results.filter((r) => r.status === "Erro");

    allSuccesses.push(...sucessos);

    if (erros.length === 0) {
      break;
    }

    console.log(`  ✅ ${sucessos.length} criados`);
    console.log(`  ❌ ${erros.length} falharam`);

    // Tentar novamente apenas os que falharam
    toCreate = erros.map((erro) => {
      const originalIndex = erro.sequencia - 1;
      return {
        sequencia: originalIndex + 1,
        contato: items[originalIndex],
      };
    });

    if (attempt < maxRetries && toCreate.length > 0) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  console.log(`\n✅ Total de sucessos: ${allSuccesses.length}`);
  return allSuccesses;
}
```

## Importação de CSV

```typescript
import fs from "fs";
import { parse } from "csv-parse/sync";

async function importContactsFromCSV(filename: string) {
  // Ler CSV
  const fileContent = fs.readFileSync(filename, "utf-8");
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
  });

  console.log(`📄 ${records.length} registros encontrados no CSV`);

  // Converter para formato do SDK
  const contacts = records.map((record: any) => ({
    nome: record.nome,
    tipo_pessoa: record.tipo_pessoa,
    cpf_cnpj: record.cpf_cnpj,
    email: record.email,
    fone: record.telefone,
  }));

  // Criar em chunks
  const results = await createInChunks(contacts, 10);

  // Relatório
  const sucessos = results.filter((r) => r.status === "OK");
  const erros = results.filter((r) => r.status === "Erro");

  console.log("\n📊 Relatório de Importação:");
  console.log(`  Total: ${records.length}`);
  console.log(`  ✅ Importados: ${sucessos.length}`);
  console.log(`  ❌ Erros: ${erros.length}`);

  // Salvar erros em arquivo
  if (erros.length > 0) {
    const errorReport = erros.map((e) => ({
      sequencia: e.sequencia,
      erros: e.erros?.map((err) => err.erro).join("; "),
    }));

    fs.writeFileSync(
      "erros-importacao.json",
      JSON.stringify(errorReport, null, 2)
    );

    console.log("\n❌ Erros salvos em: erros-importacao.json");
  }

  return { sucessos, erros };
}

// Uso
await importContactsFromCSV("contatos.csv");
```

## Atualizar em Lote

```typescript
async function updateMultipleContacts(
  updates: Array<{ id: number; changes: any }>
) {
  const batch = updates.map((update, index) => ({
    sequencia: index + 1,
    contato: {
      id: update.id,
      ...update.changes,
    },
  }));

  const results = await sdk.contact.update(batch);

  const sucessos = results.filter((r) => r.status === "OK");
  console.log(`${sucessos.length} contatos atualizados`);

  return results;
}

// Uso
await updateMultipleContacts([
  { id: 123, changes: { email: "novo@email.com" } },
  { id: 456, changes: { fone: "11999999999" } },
  { id: 789, changes: { situacao: "I" } },
]);
```

## Validação Antes do Batch

```typescript
function validateBatch(items: any[]): { valid: any[]; invalid: any[] } {
  const valid = [];
  const invalid = [];

  items.forEach((item, index) => {
    const errors = [];

    if (!item.nome || item.nome.length < 3) {
      errors.push("Nome inválido");
    }

    if (!["F", "J"].includes(item.tipo_pessoa)) {
      errors.push("Tipo de pessoa inválido");
    }

    if (errors.length > 0) {
      invalid.push({ index, item, errors });
    } else {
      valid.push(item);
    }
  });

  return { valid, invalid };
}

// Uso
const { valid, invalid } = validateBatch(contacts);

if (invalid.length > 0) {
  console.error(`❌ ${invalid.length} itens inválidos:`);
  invalid.forEach(({ index, errors }) => {
    console.error(`  Item ${index}: ${errors.join(", ")}`);
  });
}

if (valid.length > 0) {
  console.log(`✅ ${valid.length} itens válidos, criando...`);
  const results = await createInChunks(valid, 10);
}
```

## Progress Bar para Batch

```typescript
async function createWithProgress(items: any[]) {
  const total = items.length;
  let completed = 0;

  const chunks = chunk(items, 10);

  for (const [index, chunkItems] of chunks.entries()) {
    const batch = chunkItems.map((item, i) => ({
      sequencia: i + 1,
      contato: item,
    }));

    const results = await sdk.contact.create(batch);

    completed += chunkItems.length;
    const percent = ((completed / total) * 100).toFixed(1);

    console.log(`⏳ Progresso: ${percent}% (${completed}/${total})`);
  }
}
```

## Melhores Práticas

1. **Tamanho do Lote**: Use 5-10 itens por batch
2. **Sequência**: Sempre use sequência única (1, 2, 3...)
3. **Validação**: Valide antes de enviar
4. **Chunking**: Divida grandes volumes
5. **Delay**: Aguarde entre chunks.
6. **Retry**: Implemente retry para falhas temporárias
7. **Logging**: Registre sucessos e erros
8. **Relatórios**: Gere relatórios de importação

## Próximos Passos

- [Ver tratamento de erros](/guides/error-handling)
- [Aprender sobre paginação](/guides/pagination)
- [Consultar API Reference](/api/index)
