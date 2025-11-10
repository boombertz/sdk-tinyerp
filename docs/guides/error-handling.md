# Tratamento de Erros

O SDK TinyERP usa uma classe de erro customizada (`TinyApiError`) que preserva todos os detalhes retornados pela API.

## TinyApiError

### Propriedades

```typescript
class TinyApiError extends Error {
  codigo: string;                    // Código do erro
  statusProcessamento: string;       // "OK", "Erro", "Processamento"
  erros: Array<{ erro: string }>;   // Array de erros detalhados
}
```

## Capturando Erros

### Exemplo Básico

```typescript
import { TinyApiError } from 'sdk-tinyerp';

try {
  const product = await sdk.product.getById(999999);
} catch (error) {
  if (error instanceof TinyApiError) {
    console.error('Código:', error.codigo);
    console.error('Status:', error.statusProcessamento);
    console.error('Mensagem:', error.message);

    // Erros detalhados
    error.erros.forEach(e => {
      console.error('  -', e.erro);
    });
  } else {
    console.error('Erro desconhecido:', error);
  }
}
```

## Erros Comuns

### Token Inválido

```typescript
try {
  const info = await sdk.account.getInfo();
} catch (error) {
  if (error instanceof TinyApiError) {
    if (error.message.includes('token') || error.codigo === '401') {
      console.error('❌ Token inválido ou expirado');
      // Notificar admin, tentar renovar token, etc.
    }
  }
}
```

### Registro Não Encontrado

```typescript
try {
  const contact = await sdk.contact.getById(123456);
} catch (error) {
  if (error instanceof TinyApiError) {
    if (error.message.includes('não encontrado')) {
      console.log('Contato não existe');
      return null;
    }
  }
  throw error;
}
```

### Erro de Validação

```typescript
try {
  const result = await sdk.contact.create([{
    sequencia: 1,
    contato: {
      nome: 'João',
      tipo_pessoa: 'F'
      // Falta CPF obrigatório
    }
  }]);
} catch (error) {
  if (error instanceof TinyApiError) {
    console.error('Erros de validação:');
    error.erros.forEach(e => console.error(`  - ${e.erro}`));
  }
}
```

## Retry em Caso de Falha

```typescript
async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (error instanceof TinyApiError) {
        // Não fazer retry em erros de validação
        if (error.statusProcessamento === 'Erro') {
          throw error;
        }
      }

      if (attempt === maxRetries) {
        throw error;
      }

      console.log(`Tentativa ${attempt} falhou, tentando novamente em ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2; // Backoff exponencial
    }
  }
  throw new Error('Não deveria chegar aqui');
}

// Uso
const products = await fetchWithRetry(() => sdk.product.search('notebook'));
```

## Erros em Operações em Lote

```typescript
const results = await sdk.product.create([
  { sequencia: 1, data: { /* produto 1 */ } },
  { sequencia: 2, data: { /* produto 2 */ } },
  { sequencia: 3, data: { /* produto 3 */ } }
]);

// Separar sucessos e erros
const sucessos = results.filter(r => r.status === 'OK');
const erros = results.filter(r => r.status === 'Erro');

console.log(`✅ ${sucessos.length} criados`);
console.log(`❌ ${erros.length} com erro`);

// Processar erros
if (erros.length > 0) {
  console.error('\nErros encontrados:');
  erros.forEach(erro => {
    console.error(`\nSequência ${erro.sequencia}:`);
    erro.erros?.forEach(e => {
      console.error(`  - ${e.erro}`);
    });
  });

  // Opcional: tentar criar novamente apenas os que falharam
  const retry = erros.map(e => {
    const original = results.find(r => r.sequencia === e.sequencia);
    return original;
  }).filter(Boolean);

  // Corrigir problemas e tentar novamente...
}
```

## Logging de Erros

```typescript
class ErrorLogger {
  static log(error: unknown, context: string) {
    const timestamp = new Date().toISOString();

    if (error instanceof TinyApiError) {
      console.error(`[${timestamp}] [${context}] TinyApiError:`, {
        codigo: error.codigo,
        status: error.statusProcessamento,
        message: error.message,
        erros: error.erros
      });

      // Enviar para serviço de monitoramento (Sentry, etc.)
      // Sentry.captureException(error, { extra: { context } });
    } else {
      console.error(`[${timestamp}] [${context}] UnknownError:`, error);
    }
  }
}

// Uso
try {
  await sdk.product.create([...]);
} catch (error) {
  ErrorLogger.log(error, 'ProductCreation');
  throw error;
}
```

## Validação Preventiva

```typescript
function validateContact(contact: any): string[] {
  const errors: string[] = [];

  if (!contact.nome || contact.nome.length < 3) {
    errors.push('Nome deve ter no mínimo 3 caracteres');
  }

  if (!['F', 'J'].includes(contact.tipo_pessoa)) {
    errors.push('Tipo de pessoa inválido (F ou J)');
  }

  if (contact.tipo_pessoa === 'F' && (!contact.cpf_cnpj || contact.cpf_cnpj.length !== 11)) {
    errors.push('CPF inválido para Pessoa Física');
  }

  if (contact.email && !contact.email.includes('@')) {
    errors.push('Email inválido');
  }

  return errors;
}

// Uso
const validationErrors = validateContact(newContact);
if (validationErrors.length > 0) {
  console.error('Erros de validação antes de enviar:');
  validationErrors.forEach(e => console.error(`  - ${e}`));
  return;
}

// Agora sim, criar o contato
const result = await sdk.contact.create([{ sequencia: 1, contato: newContact }]);
```

## Wrapper de Erro Customizado

```typescript
class SDKErrorHandler {
  static async execute<T>(
    fn: () => Promise<T>,
    errorMessage: string
  ): Promise<T | null> {
    try {
      return await fn();
    } catch (error) {
      if (error instanceof TinyApiError) {
        console.error(`${errorMessage}:`, error.message);
        console.error('Detalhes:', error.erros.map(e => e.erro).join(', '));
        return null;
      }
      throw error;
    }
  }
}

// Uso
const product = await SDKErrorHandler.execute(
  () => sdk.product.getById(123),
  'Erro ao buscar produto'
);

if (!product) {
  console.log('Produto não encontrado ou erro na busca');
}
```

## Próximos Passos

- [Aprender sobre paginação](/guides/pagination)
- [Ver operações em lote](/guides/batch-operations)
- [Consultar API Reference](/api/index)
