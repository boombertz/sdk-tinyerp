# SDK TinyERP (Unofficial)

SDK não oficial para a API do TinyERP (Olist), desenvolvido em TypeScript com suporte completo a tipos.

## Características

- ✅ **TypeScript**: Totalmente tipado para melhor experiência de desenvolvimento
- ✅ **ESM**: Suporte a ES Modules
- ✅ **Zero dependências**: Usa apenas APIs nativas do Node.js
- ✅ **Tratamento de erros**: Classe de erro customizada com detalhes da API
- ✅ **Testado**: Cobertura de testes com Vitest
- ✅ **Recursos implementados**:
  - Account (Conta)
  - Contacts (Contatos) - busca, obtenção, criação e atualização

## Instalação

```bash
npm install sdk-tinyerp
```

## Configuração

Para usar o SDK, você precisa de um token de acesso da API do TinyERP. Obtenha seu token no painel administrativo do TinyERP.

```typescript
import TinySDK from 'sdk-tinyerp';

const sdk = new TinySDK('seu-token-aqui');
```

## Uso

### Account (Conta)

#### Obter informações da conta

```typescript
import TinySDK from 'sdk-tinyerp';

const sdk = new TinySDK('seu-token');

try {
  const accountInfo = await sdk.account.getInfo();
  console.log('Razão Social:', accountInfo.razao_social);
  console.log('CNPJ/CPF:', accountInfo.cnpj_cpf);
  console.log('Email:', accountInfo.email);
} catch (error) {
  if (error instanceof TinyApiError) {
    console.error('Erro da API:', error.message);
    console.error('Código:', error.codigo);
  }
}
```

### Contacts (Contatos)

#### Pesquisar contatos

```typescript
// Busca simples
const result = await sdk.contact.search('João');
console.log(`Total de contatos: ${result.numero_paginas * result.retorno.contatos.length}`);
result.retorno.contatos.forEach(contact => {
  console.log(`${contact.nome} - ${contact.codigo}`);
});

// Busca com filtros
const filteredResult = await sdk.contact.search('', {
  cpf_cnpj: '12345678901',
  situacao: 'A', // A = Ativo
  pagina: 1
});
```

#### Obter detalhes de um contato

```typescript
const contactId = 123456;
const contactDetails = await sdk.contact.getById(contactId);

console.log('Nome:', contactDetails.nome);
console.log('Email:', contactDetails.email);
console.log('Endereço:', contactDetails.endereco);
console.log('Telefone:', contactDetails.fone);

// Pessoas de contato
if (contactDetails.pessoas_contato?.length > 0) {
  contactDetails.pessoas_contato.forEach(pessoa => {
    console.log(`Contato: ${pessoa.nome} - ${pessoa.email}`);
  });
}
```

#### Criar contatos

```typescript
// Criar um único contato
const newContacts = await sdk.contact.create([
  {
    sequencia: 1,
    contato: {
      codigo: 'CLI001',
      nome: 'João Silva',
      tipo_pessoa: 'F', // F = Física, J = Jurídica
      cpf_cnpj: '12345678901',
      email: 'joao@example.com',
      fone: '11999999999',
      endereco: 'Rua Exemplo, 123',
      numero: '123',
      bairro: 'Centro',
      cep: '12345-678',
      cidade: 'São Paulo',
      uf: 'SP'
    }
  }
]);

console.log('Contato criado:', newContacts[0].status);

// Criar múltiplos contatos
const multipleContacts = await sdk.contact.create([
  {
    sequencia: 1,
    contato: {
      nome: 'Empresa ABC Ltda',
      tipo_pessoa: 'J',
      cpf_cnpj: '12345678000199',
      email: 'contato@empresaabc.com'
    }
  },
  {
    sequencia: 2,
    contato: {
      nome: 'Maria Santos',
      tipo_pessoa: 'F',
      cpf_cnpj: '98765432100',
      email: 'maria@example.com'
    }
  }
]);
```

#### Atualizar contatos

```typescript
const updatedContacts = await sdk.contact.update([
  {
    sequencia: 1,
    contato: {
      id: 123456,
      nome: 'João Silva Atualizado',
      email: 'joao.novo@example.com',
      fone: '11988888888'
    }
  }
]);

console.log('Status da atualização:', updatedContacts[0].status);
```

## Tratamento de Erros

O SDK usa uma classe de erro customizada `TinyApiError` que preserva os detalhes do erro retornado pela API:

```typescript
import { TinyApiError } from 'sdk-tinyerp';

try {
  const result = await sdk.contact.getById(999999);
} catch (error) {
  if (error instanceof TinyApiError) {
    console.error('Mensagem:', error.message);
    console.error('Código:', error.codigo);
    console.error('Status:', error.statusProcessamento);

    // Detalhes adicionais dos erros
    error.erros.forEach(erro => {
      console.error(`Erro: ${erro.erro}`);
    });
  }
}
```

## Estrutura do Projeto

```
sdk-tinyerp/
├── src/
│   ├── index.ts                 # Ponto de entrada principal do SDK
│   ├── http-client.ts           # Cliente HTTP para comunicação com a API
│   ├── errors/
│   │   └── tiny-api-error.ts    # Classe de erro customizada
│   ├── resources/
│   │   ├── account.ts           # Resource de Account (conta)
│   │   ├── account.test.ts      # Testes do Account
│   │   ├── contacts.ts          # Resource de Contacts (contatos)
│   │   └── contacts.test.ts     # Testes dos Contacts
│   └── types/
│       ├── account.ts           # Tipos TypeScript para Account
│       └── contacts.ts          # Tipos TypeScript para Contacts
├── package.json
├── tsconfig.json
└── README.md
```

## Desenvolvimento

### Pré-requisitos

- Node.js >= 18 (para suporte a fetch nativo)
- npm ou yarn

### Instalação das dependências

```bash
npm install
```

### Scripts disponíveis

```bash
# Compilar o projeto
npm run build

# Modo de desenvolvimento (watch)
npm run dev

# Executar testes
npm test

# Executar testes em modo watch
npm run test:watch
```

### Executar testes

O projeto usa Vitest para testes unitários:

```bash
npm test
```

Os testes cobrem:
- Sucesso e falha nas requisições
- Tratamento de erros da API
- Transformação de dados (wrapping/unwrapping)
- Validação de payloads

## API do TinyERP

Este SDK implementa a API v2 do TinyERP. Documentação oficial: https://api.tiny.com.br/

**Base URL**: `https://api.tiny.com.br/api2`

### Endpoints implementados

- `POST /info.php` - Obter informações da conta
- `POST /contatos.pesquisa.php` - Pesquisar contatos
- `POST /contato.obter.php` - Obter detalhes de um contato
- `POST /contato.incluir.php` - Criar contatos
- `POST /contato.alterar.php` - Atualizar contatos

## Roadmap

Recursos planejados para futuras versões:

- [ ] Produtos
- [ ] Pedidos
- [ ] Notas Fiscais
- [ ] Estoque
- [ ] Financeiro
- [ ] Suporte a webhooks

## Contribuindo

Contribuições são bem-vindas! Por favor:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### Diretrizes de contribuição

- Mantenha a cobertura de testes
- Adicione JSDoc para novos métodos e tipos
- Siga o estilo de código existente
- Atualize o README se necessário

## Licença

Este projeto é um SDK não oficial e não possui afiliação com o TinyERP ou Olist.

## Suporte

Para problemas relacionados ao SDK, abra uma issue no repositório.

Para questões sobre a API do TinyERP, consulte a [documentação oficial](https://api.tiny.com.br/).

## Changelog

Veja [CHANGELOG.md](CHANGELOG.md) para detalhes sobre as versões.
