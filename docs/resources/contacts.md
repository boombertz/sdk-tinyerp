# Contacts Resource

O resource `Contacts` oferece operações completas (CRUD) para gerenciar contatos no TinyERP.

## Métodos Disponíveis

| Método | Descrição | Endpoint |
|--------|-----------|----------|
| `search()` | Pesquisar contatos | `POST /contatos.pesquisa.php` |
| `getById()` | Obter detalhes de um contato | `POST /contato.obter.php` |
| `create()` | Criar contatos em lote | `POST /contato.incluir.php` |
| `update()` | Atualizar contatos em lote | `POST /contato.alterar.php` |

## search()

Pesquisa contatos com suporte a filtros e paginação.

```typescript
search(pesquisa: string, options?: ContactSearchOptions): Promise<PaginatedContactsResponse>
```

### Parâmetros

- `pesquisa`: Termo de busca (nome, código, email, etc.)
- `options`: Filtros opcionais
  - `cpf_cnpj`: Filtrar por CPF/CNPJ
  - `situacao`: "A" (Ativo), "I" (Inativo), "E" (Excluído)
  - `pagina`: Número da página (padrão: 1)

### Exemplos

```typescript
// Busca simples
const result = await sdk.contact.search('João');
console.log(`Encontrados ${result.contatos.length} contatos`);

// Busca com filtros
const ativos = await sdk.contact.search('', {
  situacao: 'A',
  pagina: 1
});

// Busca por CPF
const porCPF = await sdk.contact.search('', {
  cpf_cnpj: '12345678901'
});
```

## getById()

Obtém detalhes completos de um contato específico.

```typescript
getById(id: number): Promise<ContactDetails>
```

### Exemplo

```typescript
const contact = await sdk.contact.getById(123456);

console.log('Nome:', contact.nome);
console.log('Email:', contact.email);
console.log('Telefone:', contact.fone);
console.log('Endereço:', contact.endereco);

// Pessoas de contato
if (contact.pessoas_contato) {
  contact.pessoas_contato.forEach(pessoa => {
    console.log(`  ${pessoa.nome} - ${pessoa.email}`);
  });
}
```

## create()

Cria um ou mais contatos em lote.

```typescript
create(contacts: ContactCreateEntry[]): Promise<ContactCreateResultRecord[]>
```

### Exemplo - Contato Simples

```typescript
const result = await sdk.contact.create([
  {
    sequencia: 1,
    contato: {
      nome: 'João Silva',
      tipo_pessoa: 'F',  // F = Física, J = Jurídica
      cpf_cnpj: '12345678901',
      email: 'joao@email.com',
      fone: '11999999999'
    }
  }
]);

if (result[0].status === 'OK') {
  console.log('Contato criado! ID:', result[0].id);
}
```

### Exemplo - Contato Completo

```typescript
const completo = await sdk.contact.create([
  {
    sequencia: 1,
    contato: {
      codigo: 'CLI001',
      nome: 'Maria Santos',
      tipo_pessoa: 'F',
      cpf_cnpj: '98765432100',
      email: 'maria@email.com',
      fone: '11988888888',
      celular: '11977777777',
      endereco: 'Rua das Flores',
      numero: '123',
      complemento: 'Apto 45',
      bairro: 'Centro',
      cep: '01234-567',
      cidade: 'São Paulo',
      uf: 'SP',
      situacao: 'A',
      pessoas_contato: [
        {
          nome: 'João Santos',
          email: 'joao@email.com',
          cargo: 'Gerente',
          fone: '11966666666'
        }
      ]
    }
  }
]);
```

### Exemplo - Criar em Lote

```typescript
const lote = await sdk.contact.create([
  {
    sequencia: 1,
    contato: { nome: 'Cliente 1', tipo_pessoa: 'F', cpf_cnpj: '111', email: 'c1@email.com' }
  },
  {
    sequencia: 2,
    contato: { nome: 'Cliente 2', tipo_pessoa: 'F', cpf_cnpj: '222', email: 'c2@email.com' }
  },
  {
    sequencia: 3,
    contato: { nome: 'Cliente 3', tipo_pessoa: 'J', cpf_cnpj: '333', email: 'c3@email.com' }
  }
]);

const sucessos = lote.filter(r => r.status === 'OK');
console.log(`${sucessos.length} contatos criados com sucesso`);
```

## update()

Atualiza um ou mais contatos existentes.

```typescript
update(contacts: ContactUpdateEntry[]): Promise<ContactCreateResultRecord[]>
```

### Exemplo

```typescript
const updated = await sdk.contact.update([
  {
    sequencia: 1,
    contato: {
      id: 123456,  // ID obrigatório para update
      nome: 'João Silva Atualizado',
      email: 'joao.novo@email.com',
      fone: '11955555555'
    }
  }
]);

if (updated[0].status === 'OK') {
  console.log('Contato atualizado com sucesso!');
}
```

## Paginação

O método `search()` retorna resultados paginados:

```typescript
const page1 = await sdk.contact.search('Silva', { pagina: 1 });

console.log('Página:', page1.pagina);
console.log('Total de páginas:', page1.numero_paginas);
console.log('Contatos nesta página:', page1.contatos.length);

// Iterar por todas as páginas
for (let p = 1; p <= page1.numero_paginas; p++) {
  const page = await sdk.contact.search('Silva', { pagina: p });
  console.log(`Página ${p}: ${page.contatos.length} contatos`);
}
```

## Tratamento de Erros em Lote

```typescript
const results = await sdk.contact.create([...]);

const sucessos = results.filter(r => r.status === 'OK');
const erros = results.filter(r => r.status === 'Erro');

console.log(`✅ ${sucessos.length} sucessos`);
console.log(`❌ ${erros.length} erros`);

erros.forEach(erro => {
  console.log(`Sequência ${erro.sequencia}:`);
  erro.erros?.forEach(e => console.log(`  - ${e.erro}`));
});
```

## Campos Importantes

### Tipo de Pessoa

- `"F"`: Pessoa Física (CPF)
- `"J"`: Pessoa Jurídica (CNPJ)

### Situação

- `"A"`: Ativo
- `"I"`: Inativo
- `"E"`: Excluído

## Próximos Passos

- [Ver documentação do Products Resource](/resources/products)
- [Aprender sobre operações em lote](/guides/batch-operations)
- [Consultar API Reference](/api/)
