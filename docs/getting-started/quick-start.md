# Início Rápido

Este guia mostra exemplos práticos de uso do SDK TinyERP para você começar rapidamente.

## Setup Inicial

Primeiro, importe e inicialize o SDK:

```typescript
import TinySDK from 'sdk-tinyerp';

// Configure seu token (use variáveis de ambiente em produção!)
const sdk = new TinySDK(process.env.TINY_API_TOKEN!);
```

## Exemplo 1: Obter Informações da Conta

A forma mais simples de validar que tudo está funcionando:

```typescript
async function getAccountInfo() {
  try {
    const info = await sdk.account.getInfo();

    console.log('===== INFORMAÇÕES DA CONTA =====');
    console.log('Razão Social:', info.razao_social);
    console.log('CNPJ/CPF:', info.cnpj_cpf);
    console.log('Email:', info.email);
    console.log('Telefone:', info.fone);
    console.log('Cidade:', info.cidade, '/', info.uf);
  } catch (error) {
    console.error('Erro ao obter informações:', error);
  }
}

getAccountInfo();
```

**Saída esperada:**
```
===== INFORMAÇÕES DA CONTA =====
Razão Social: Minha Empresa LTDA
CNPJ/CPF: 12.345.678/0001-99
Email: contato@minhaempresa.com
Telefone: (11) 98765-4321
Cidade: São Paulo / SP
```

## Exemplo 2: Pesquisar Contatos

Buscar contatos por nome ou filtros:

```typescript
async function searchContacts() {
  try {
    // Busca simples por nome
    const result = await sdk.contact.search('João');

    console.log(`Encontrados ${result.contatos.length} contatos`);
    console.log(`Página ${result.pagina} de ${result.numero_paginas}`);

    result.contatos.forEach((contact, index) => {
      console.log(`\n[${index + 1}] ${contact.nome}`);
      console.log(`    Código: ${contact.codigo}`);
      console.log(`    Tipo: ${contact.tipo_pessoa === 'F' ? 'Pessoa Física' : 'Pessoa Jurídica'}`);
      console.log(`    CPF/CNPJ: ${contact.cpf_cnpj || 'Não informado'}`);
    });
  } catch (error) {
    console.error('Erro ao buscar contatos:', error);
  }
}

searchContacts();
```

## Exemplo 3: Criar um Novo Contato

Criar um contato completo:

```typescript
async function createContact() {
  try {
    const newContact = await sdk.contact.create([
      {
        sequencia: 1,
        contato: {
          codigo: 'CLI001',
          nome: 'Maria Santos Silva',
          tipo_pessoa: 'F',
          cpf_cnpj: '12345678901',
          email: 'maria.santos@email.com',
          fone: '(11) 98765-4321',
          endereco: 'Rua das Flores',
          numero: '123',
          complemento: 'Apto 45',
          bairro: 'Jardim Primavera',
          cep: '12345-678',
          cidade: 'São Paulo',
          uf: 'SP',
          // Pessoa de contato
          pessoas_contato: [
            {
              nome: 'João Santos',
              email: 'joao.santos@email.com',
              cargo: 'Responsável',
              fone: '(11) 91234-5678'
            }
          ]
        }
      }
    ]);

    if (newContact[0].status === 'OK') {
      console.log('✅ Contato criado com sucesso!');
      console.log('ID:', newContact[0].id);
    } else {
      console.log('❌ Erro ao criar contato:');
      newContact[0].erros?.forEach(erro => {
        console.log(`  - ${erro.erro}`);
      });
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
  }
}

createContact();
```

## Exemplo 4: Pesquisar Produtos

Buscar produtos com filtros:

```typescript
async function searchProducts() {
  try {
    // Buscar produtos ativos que contenham "notebook"
    const result = await sdk.product.search('notebook', {
      situacao: 'A',  // Apenas ativos
      pagina: 1
    });

    console.log(`===== ${result.produtos.length} PRODUTOS ENCONTRADOS =====\n`);

    result.produtos.forEach((product, index) => {
      console.log(`[${index + 1}] ${product.nome}`);
      console.log(`    SKU: ${product.codigo}`);
      console.log(`    Preço: R$ ${product.preco.toFixed(2)}`);
      console.log(`    Estoque: ${product.estoque_atual} unidades`);
      console.log(`    Tipo: ${getProductType(product.classe_produto)}`);
      console.log('');
    });
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
  }
}

function getProductType(classe: string): string {
  const tipos: Record<string, string> = {
    'S': 'Simples',
    'V': 'Com Variações',
    'K': 'Kit',
    'E': 'Com Estrutura'
  };
  return tipos[classe] || 'Desconhecido';
}

searchProducts();
```

## Exemplo 5: Obter Detalhes de um Produto

Ver informações completas incluindo variações e kits:

```typescript
async function getProductDetails(productId: number) {
  try {
    const product = await sdk.product.getById(productId);

    console.log('===== DETALHES DO PRODUTO =====');
    console.log('Nome:', product.nome);
    console.log('SKU:', product.codigo);
    console.log('GTIN/EAN:', product.gtin || 'Não informado');
    console.log('Preço:', `R$ ${product.preco.toFixed(2)}`);
    console.log('Estoque Atual:', product.estoque_atual);
    console.log('Estoque Mínimo:', product.estoque_minimo);
    console.log('Peso Líquido:', product.peso_liquido, 'kg');
    console.log('Situação:', product.situacao === 'A' ? 'Ativo' : 'Inativo');

    // Variações
    if (product.variacoes && product.variacoes.length > 0) {
      console.log('\n===== VARIAÇÕES =====');
      product.variacoes.forEach((variacao, index) => {
        console.log(`\n[${index + 1}] ${variacao.codigo}`);
        console.log(`    Preço: R$ ${variacao.preco.toFixed(2)}`);
        console.log(`    Estoque: ${variacao.estoque_atual}`);
        console.log('    Grade:', JSON.stringify(variacao.grade));
      });
    }

    // Kit
    if (product.classe_produto === 'K' && product.kit) {
      console.log('\n===== ITENS DO KIT =====');
      product.kit.forEach((item, index) => {
        console.log(`[${index + 1}] Produto ID: ${item.id_produto}`);
        console.log(`    Quantidade: ${item.quantidade}`);
      });
    }

    // SEO
    if (product.seo_title || product.seo_description) {
      console.log('\n===== SEO =====');
      console.log('Title:', product.seo_title || '-');
      console.log('Description:', product.seo_description || '-');
      console.log('Slug:', product.slug || '-');
    }
  } catch (error) {
    console.error('Erro ao obter produto:', error);
  }
}

getProductDetails(123456);
```

## Exemplo 6: Criar Produto Simples

```typescript
async function createSimpleProduct() {
  try {
    const result = await sdk.product.create([
      {
        sequencia: 1,
        data: {
          nome: 'Mouse Gamer RGB',
          codigo: 'MOUSE-001',
          unidade: 'UN',
          preco: 149.90,
          origem: '0',
          situacao: 'A',
          tipo: 'P',
          gtin: '7891234567890',
          ncm: '84716060',
          peso_bruto: 0.15,
          peso_liquido: 0.12,
          estoque_minimo: 10,
          estoque_atual: 50
        }
      }
    ]);

    if (result[0].status === 'OK') {
      console.log('✅ Produto criado com sucesso!');
      console.log('ID do produto:', result[0].id);
    } else {
      console.log('❌ Erro ao criar produto:');
      result[0].erros?.forEach(e => console.log(`  - ${e.erro}`));
    }
  } catch (error) {
    console.error('Erro:', error);
  }
}

createSimpleProduct();
```

## Exemplo 7: Criar Produto com Variações

```typescript
async function createProductWithVariations() {
  try {
    const result = await sdk.product.create([
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
          classe_produto: 'V', // Com variações
          variacoes: [
            {
              codigo: 'CAM-BASIC-AZUL-P',
              preco: 49.90,
              grade: {
                'Cor': 'Azul',
                'Tamanho': 'P'
              },
              estoque_atual: 20
            },
            {
              codigo: 'CAM-BASIC-AZUL-M',
              preco: 49.90,
              grade: {
                'Cor': 'Azul',
                'Tamanho': 'M'
              },
              estoque_atual: 30
            },
            {
              codigo: 'CAM-BASIC-VERM-P',
              preco: 54.90,
              grade: {
                'Cor': 'Vermelho',
                'Tamanho': 'P'
              },
              estoque_atual: 15
            }
          ]
        }
      }
    ]);

    if (result[0].status === 'OK') {
      console.log('✅ Produto com variações criado!');
      console.log('ID:', result[0].id);
      console.log('Total de variações criadas: 3');
    }
  } catch (error) {
    console.error('Erro:', error);
  }
}

createProductWithVariations();
```

## Exemplo 8: Tratamento de Erros

Como lidar com erros de forma robusta:

```typescript
import { TinyApiError } from 'sdk-tinyerp';

async function robustExample() {
  try {
    const products = await sdk.product.search('notebook');

    if (products.produtos.length === 0) {
      console.log('Nenhum produto encontrado');
      return;
    }

    console.log(`Encontrados ${products.produtos.length} produtos`);

  } catch (error) {
    if (error instanceof TinyApiError) {
      // Erro da API do TinyERP
      console.error('Erro da API TinyERP:');
      console.error('  Código:', error.codigo);
      console.error('  Status:', error.statusProcessamento);
      console.error('  Mensagem:', error.message);

      // Detalhes dos erros
      if (error.erros && error.erros.length > 0) {
        console.error('  Detalhes:');
        error.erros.forEach((e, i) => {
          console.error(`    ${i + 1}. ${e.erro}`);
        });
      }
    } else {
      // Erro de rede ou outro
      console.error('Erro inesperado:', error);
    }
  }
}

robustExample();
```

## Exemplo 9: Operações em Lote

Criar múltiplos contatos de uma vez:

```typescript
async function batchCreateContacts() {
  const contacts = [
    {
      sequencia: 1,
      contato: { nome: 'João Silva', tipo_pessoa: 'F', cpf_cnpj: '111', email: 'joao@email.com' }
    },
    {
      sequencia: 2,
      contato: { nome: 'Maria Santos', tipo_pessoa: 'F', cpf_cnpj: '222', email: 'maria@email.com' }
    },
    {
      sequencia: 3,
      contato: { nome: 'Empresa XYZ', tipo_pessoa: 'J', cpf_cnpj: '333', email: 'xyz@email.com' }
    }
  ];

  try {
    const results = await sdk.contact.create(contacts);

    // Separar sucessos e erros
    const sucessos = results.filter(r => r.status === 'OK');
    const erros = results.filter(r => r.status === 'Erro');

    console.log(`✅ ${sucessos.length} contatos criados com sucesso`);
    console.log(`❌ ${erros.length} contatos com erro`);

    // Mostrar erros
    if (erros.length > 0) {
      console.log('\nErros encontrados:');
      erros.forEach(erro => {
        console.log(`  Sequência ${erro.sequencia}:`);
        erro.erros?.forEach(e => console.log(`    - ${e.erro}`));
      });
    }
  } catch (error) {
    console.error('Erro na operação em lote:', error);
  }
}

batchCreateContacts();
```

## Exemplo 10: Script Completo de Integração

Um exemplo real de integração completa:

```typescript
import TinySDK, { TinyApiError } from 'sdk-tinyerp';

async function syncProductsFromExternalSource() {
  const sdk = new TinySDK(process.env.TINY_API_TOKEN!);

  // 1. Buscar produtos do TinyERP
  console.log('📥 Buscando produtos do TinyERP...');
  const tinyProducts = await sdk.product.search('', { situacao: 'A', pagina: 1 });
  console.log(`  Encontrados: ${tinyProducts.produtos.length} produtos`);

  // 2. Buscar produtos de fonte externa (exemplo)
  const externalProducts = await fetchFromExternalAPI();
  console.log(`📦 Produtos na fonte externa: ${externalProducts.length}`);

  // 3. Comparar e identificar produtos novos
  const existingCodes = new Set(tinyProducts.produtos.map(p => p.codigo));
  const newProducts = externalProducts.filter(p => !existingCodes.has(p.sku));
  console.log(`🆕 Produtos novos para criar: ${newProducts.length}`);

  // 4. Criar produtos novos em lote
  if (newProducts.length > 0) {
    const batch = newProducts.map((p, index) => ({
      sequencia: index + 1,
      data: {
        nome: p.name,
        codigo: p.sku,
        preco: p.price,
        unidade: 'UN',
        origem: '0',
        situacao: 'A',
        tipo: 'P'
      }
    }));

    try {
      const results = await sdk.product.create(batch);
      const sucessos = results.filter(r => r.status === 'OK');
      console.log(`✅ ${sucessos.length} produtos criados com sucesso!`);
    } catch (error) {
      if (error instanceof TinyApiError) {
        console.error('❌ Erro ao criar produtos:', error.message);
      }
    }
  }

  console.log('✅ Sincronização concluída!');
}

// Função de exemplo
async function fetchFromExternalAPI() {
  return [
    { sku: 'PROD-001', name: 'Produto 1', price: 100 },
    { sku: 'PROD-002', name: 'Produto 2', price: 200 }
  ];
}

syncProductsFromExternalSource();
```

## Próximos Passos

Agora que você viu exemplos práticos:

- [Explore a documentação de cada Resource](/resources/account)
- [Aprenda sobre paginação](/guides/pagination)
- [Entenda operações em lote](/guides/batch-operations)
- [Consulte a API Reference completa](/api/index)
