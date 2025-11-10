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
  - Products (Produtos) - busca, obtenção e criação

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

### Products (Produtos)

#### Pesquisar produtos

```typescript
// Busca simples por termo
const result = await sdk.product.search('notebook');
console.log(`Encontrados ${result.produtos.length} produtos`);
console.log(`Página ${result.pagina} de ${result.numero_paginas}`);

result.produtos.forEach(product => {
  console.log(`${product.nome} - R$ ${product.preco}`);
  console.log(`  Código: ${product.codigo}`);
  console.log(`  Estoque: ${product.estoque_atual}`);
});

// Busca com filtros avançados
const filteredResult = await sdk.product.search('mouse', {
  situacao: 'A',        // A = Ativo, I = Inativo, E = Excluído
  pagina: 2,
  idListaPreco: 123,    // Filtrar por lista de preços
  idTag: 456            // Filtrar por tag
});

// Busca por GTIN/EAN
const productByGtin = await sdk.product.search('', {
  gtin: '7891234567890'
});
```

#### Obter detalhes de um produto

```typescript
const productId = 12345;
const product = await sdk.product.getById(productId);

console.log('Nome:', product.nome);
console.log('Preço:', product.preco);
console.log('Código/SKU:', product.codigo);
console.log('GTIN/EAN:', product.gtin);
console.log('NCM:', product.ncm);
console.log('Estoque atual:', product.estoque_atual);
console.log('Estoque mínimo:', product.estoque_minimo);

// Acessar variações de produtos
if (product.variacoes && product.variacoes.length > 0) {
  console.log('\nVariações disponíveis:');
  product.variacoes.forEach(variacao => {
    console.log(`  Código: ${variacao.codigo}`);
    console.log(`  Preço: R$ ${variacao.preco}`);
    console.log(`  Grade:`, variacao.grade); // Ex: { "Cor": "Azul", "Tamanho": "M" }
    console.log(`  Estoque: ${variacao.estoque_atual}`);
  });
}

// Acessar itens de um kit
if (product.classe_produto === 'K' && product.kit && product.kit.length > 0) {
  console.log('\nItens do kit:');
  product.kit.forEach(item => {
    console.log(`  Produto ID ${item.id_produto}: ${item.quantidade} unidade(s)`);
  });
}

// Dados de SEO e e-commerce
console.log('\nSEO:');
console.log('Title:', product.seo_title);
console.log('Description:', product.seo_description);
console.log('Slug:', product.slug);

if (product.mapeamentos && product.mapeamentos.length > 0) {
  console.log('\nMapeamentos de e-commerce:');
  product.mapeamentos.forEach(m => {
    console.log(`  Plataforma ${m.idEcommerce}: ${m.skuMapeamento}`);
  });
}
```

#### Criar produtos

```typescript
// Criar um produto simples
const simpleProduct = await sdk.product.create([
  {
    sequencia: 1,
    data: {
      nome: 'Notebook Dell Inspiron 15',
      unidade: 'UN',
      preco: 3500.00,
      origem: '0',
      situacao: 'A',
      tipo: 'P',
      codigo: 'DELL-INS15',
      gtin: '7891234567890',
      ncm: '84713012',
      peso_bruto: 2.5,
      peso_liquido: 2.3
    }
  }
]);

if (simpleProduct[0].status === 'OK') {
  console.log('Produto criado com ID:', simpleProduct[0].id);
} else {
  console.error('Erro:', simpleProduct[0].erros);
}

// Criar produto com variações
const productWithVariations = await sdk.product.create([
  {
    sequencia: 1,
    data: {
      nome: 'Camiseta Básica',
      unidade: 'UN',
      preco: 49.90,
      origem: '0',
      situacao: 'A',
      tipo: 'P',
      classe_produto: 'V', // V = Produto com variações
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
          preco: 49.90,
          grade: { 'Cor': 'Vermelho', 'Tamanho': 'P' },
          estoque_atual: 8
        }
      ]
    }
  }
]);

// Criar um kit de produtos
const kitProduct = await sdk.product.create([
  {
    sequencia: 1,
    data: {
      nome: 'Kit Escritório Completo',
      unidade: 'UN',
      preco: 4500.00,
      origem: '0',
      situacao: 'A',
      tipo: 'P',
      classe_produto: 'K', // K = Kit
      kit: [
        { id_produto: 12345, quantidade: 1 },  // Notebook
        { id_produto: 12346, quantidade: 1 },  // Mouse
        { id_produto: 12347, quantidade: 1 }   // Teclado
      ]
    }
  }
]);

// Criar múltiplos produtos em lote
const batchProducts = await sdk.product.create([
  {
    sequencia: 1,
    data: {
      nome: 'Produto 1',
      unidade: 'UN',
      preco: 100.00,
      origem: '0',
      situacao: 'A',
      tipo: 'P'
    }
  },
  {
    sequencia: 2,
    data: {
      nome: 'Produto 2',
      unidade: 'UN',
      preco: 200.00,
      origem: '0',
      situacao: 'A',
      tipo: 'P'
    }
  },
  {
    sequencia: 3,
    data: {
      nome: 'Serviço de Consultoria',
      unidade: 'HR',
      preco: 150.00,
      origem: '0',
      situacao: 'A',
      tipo: 'S' // S = Serviço
    }
  }
]);

// Processar resultados do lote
const sucessos = batchProducts.filter(r => r.status === 'OK');
const erros = batchProducts.filter(r => r.status === 'Erro');

console.log(`${sucessos.length} produtos criados com sucesso`);
console.log(`${erros.length} produtos com erro`);

erros.forEach(erro => {
  console.error(`Sequência ${erro.sequencia}:`, erro.erros);
});
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
│   │   ├── contacts.test.ts     # Testes dos Contacts
│   │   ├── products.ts          # Resource de Products (produtos)
│   │   └── products.test.ts     # Testes dos Products
│   └── types/
│       ├── account.ts           # Tipos TypeScript para Account
│       ├── contacts.ts          # Tipos TypeScript para Contacts
│       └── products.ts          # Tipos TypeScript para Products
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

**Account**
- `POST /info.php` - Obter informações da conta

**Contacts**
- `POST /contatos.pesquisa.php` - Pesquisar contatos
- `POST /contato.obter.php` - Obter detalhes de um contato
- `POST /contato.incluir.php` - Criar contatos
- `POST /contato.alterar.php` - Atualizar contatos

**Products**
- `POST /produtos.pesquisa.php` - Pesquisar produtos
- `POST /produto.obter.php` - Obter detalhes de um produto
- `POST /produto.incluir.php` - Criar produtos

## Roadmap

Recursos planejados para futuras versões:

- [x] Produtos
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
