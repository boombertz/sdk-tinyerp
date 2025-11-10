# Account Resource

O resource `Account` permite obter informações sobre a conta/empresa vinculada ao token de autenticação.

## Método Disponível

### `getInfo()`

Retorna as informações completas da conta

.

**Endpoint:** `POST /info.php`

**Retorno:** `Promise<AccountDetails>`

## Exemplo de Uso

```typescript
import TinySDK from 'sdk-tinyerp';

const sdk = new TinySDK(process.env.TINY_API_TOKEN!);

// Obter informações da conta
const accountInfo = await sdk.account.getInfo();

console.log('Razão Social:', accountInfo.razao_social);
console.log('CNPJ/CPF:', accountInfo.cnpj_cpf);
console.log('Email:', accountInfo.email);
console.log('Telefone:', accountInfo.fone);
console.log('Endereço:', `${accountInfo.endereco}, ${accountInfo.numero}`);
console.log('Cidade:', `${accountInfo.cidade}/${accountInfo.uf}`);
console.log('CEP:', accountInfo.cep);
```

## Interface AccountDetails

```typescript
interface AccountDetails {
  razao_social: string;     // Razão social da empresa
  cnpj_cpf: string;         // CNPJ ou CPF
  email: string;            // Email principal
  fone: string;             // Telefone
  endereco: string;         // Endereço
  numero: string;           // Número
  complemento?: string;     // Complemento
  bairro: string;           // Bairro
  cep: string;              // CEP
  cidade: string;           // Cidade
  uf: string;               // UF (estado)
}
```

## Casos de Uso

### Validar Configuração

Use `getInfo()` para validar se o token está correto:

```typescript
async function validateSetup() {
  try {
    const info = await sdk.account.getInfo();
    console.log('✅ Configuração válida!');
    console.log('Conectado como:', info.razao_social);
    return true;
  } catch (error) {
    console.error('❌ Erro na configuração');
    return false;
  }
}
```

### Exibir Informações no Dashboard

```typescript
async function showAccountDashboard() {
  const info = await sdk.account.getInfo();

  return {
    empresa: info.razao_social,
    documento: info.cnpj_cpf,
    contato: {
      email: info.email,
      telefone: info.fone
    },
    localizacao: {
      endereco: `${info.endereco}, ${info.numero}`,
      bairro: info.bairro,
      cidade: `${info.cidade}/${info.uf}`,
      cep: info.cep
    }
  };
}
```

## Tratamento de Erros

```typescript
import { TinyApiError } from 'sdk-tinyerp';

try {
  const info = await sdk.account.getInfo();
} catch (error) {
  if (error instanceof TinyApiError) {
    console.error('Erro da API:', error.message);
    console.error('Código:', error.codigo);
  } else {
    console.error('Erro desconhecido:', error);
  }
}
```

## Limitações

- Este endpoint **não** aceita parâmetros
- Retorna apenas informações da conta vinculada ao token
- Não é possível obter informações de outras contas

## Próximos Passos

- [Ver documentação do Contacts Resource](/resources/contacts)
- [Ver documentação do Products Resource](/resources/products)
- [Consultar API Reference completa](/api/)
