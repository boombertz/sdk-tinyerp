---
layout: home

hero:
  name: SDK TinyERP (Olist)
  tagline: SDK não oficial para API V2
  image:
    src: /logo.svg
    alt: SDK TinyERP
  actions:
    - theme: brand
      text: Começar
      link: /getting-started/installation
    - theme: alt
      text: Ver no GitHub
      link: https://github.com/seu-usuario/sdk-tinyerp
    - theme: alt
      text: API Reference
      link: /api/index

features:
  - icon: 📘
    title: TypeScript Nativo
    details: Totalmente tipado com mais de 1.500 linhas de definições TypeScript para melhor experiência de desenvolvimento e autocomplete.

  - icon: 🚀
    title: Zero Dependências
    details: Usa apenas APIs nativas do Node.js. Leve, rápido e sem preocupações com vulnerabilidades de terceiros.

  - icon: 📦
    title: ES Modules
    details: Suporte completo a ESM (ES Modules) para projetos modernos com import/export.

  - icon: ✅
    title: Totalmente Testado
    details: Cobertura de testes com Vitest. Todos os resources possuem testes unitários completos.

  - icon: 🛡️
    title: Tratamento de Erros
    details: Classe de erro customizada que preserva todos os detalhes retornados pela API.

  - icon: 📚
    title: Bem Documentado
    details: JSDoc completo em todos os métodos e tipos, com múltiplos exemplos práticos de uso.

  - icon: 🔄
    title: Operações em Lote
    details: Suporte nativo a criação e atualização em lote (batch) de contatos e produtos.

  - icon: 📄
    title: Paginação Automática
    details: Respostas paginadas com metadados completos para facilitar navegação entre páginas.

  - icon: 🎯
    title: Resources Implementados
    details: Account (conta), Contacts (contatos) com CRUD completo, e Products (produtos) com variações e kits.
---

## Instalação Rápida

::: code-group

```bash [npm]
npm install sdk-tinyerp
```

```bash [yarn]
yarn add sdk-tinyerp
```

```bash [pnpm]
pnpm add sdk-tinyerp
```

:::

## Exemplo de Uso

```typescript
import TinySDK from "sdk-tinyerp";

const sdk = new TinySDK("seu-token-aqui");

// Obter informações da conta
const accountInfo = await sdk.account.getInfo();
console.log("Empresa:", accountInfo.razao_social);

// Pesquisar produtos
const products = await sdk.product.search("notebook", {
  situacao: "A", // Apenas ativos
  pagina: 1,
});

console.log(`Encontrados ${products.produtos.length} produtos`);
products.produtos.forEach((p) => {
  console.log(`${p.nome} - R$ ${p.preco}`);
});

// Criar um contato
const result = await sdk.contact.create([
  {
    sequencia: 1,
    contato: {
      nome: "João Silva",
      tipo_pessoa: "F",
      cpf_cnpj: "12345678901",
      email: "joao@example.com",
    },
  },
]);

if (result[0].status === "OK") {
  console.log("Contato criado com ID:", result[0].id);
}
```

## Por Que Usar?

### 🎯 Foco em Developer Experience

O SDK TinyERP foi desenvolvido pensando na experiência do desenvolvedor:

- **Autocomplete Inteligente**: IntelliSense completo em todas as propriedades
- **Validação em Tempo de Desenvolvimento**: Erros de tipo detectados antes da execução
- **Exemplos Inline**: JSDoc com exemplos práticos em cada método
- **Erros Descritivos**: Mensagens claras e detalhadas quando algo dá errado

### 🔒 Confiável e Seguro

- Zero dependências externas = menos superfície de ataque
- Classe de erro customizada com todos os detalhes da API
- Testes unitários em todos os resources
- TypeScript strict mode habilitado

### 🚀 Produtivo

- Operações em lote para melhor performance
- Transformação automática de dados ("wrapping/unwrapping")
- Suporte a filtros avançados em pesquisas
- Paginação transparente

## Recursos Disponíveis

| Resource     | Métodos                                         | Status       |
| ------------ | ----------------------------------------------- | ------------ |
| **Account**  | `getInfo()`                                     | ✅           |
| **Contacts** | `search()`, `getById()`, `create()`, `update()` | ✅           |
| **Products** | `search()`, `getById()`, `create()`             | ✅           |
| Orders       | -                                               | 🚧 Planejado |
| Invoices     | -                                               | 🚧 Planejado |
| Stock        | -                                               | 🚧 Planejado |

## Próximos Passos

<div class="vp-doc">

- [Instalar e configurar o SDK](/getting-started/installation)
- [Aprender sobre autenticação](/getting-started/authentication)
- [Ver exemplos práticos](/getting-started/quick-start)
- [Explorar Resources disponíveis](/resources/account)
- [Consultar API Reference completa](/api/index)

</div>

## Suporte

- 📖 [Documentação Completa](/)
- 🐛 [Reportar Issues](https://github.com/seu-usuario/sdk-tinyerp/issues)
- 💬 [Discussões](https://github.com/seu-usuario/sdk-tinyerp/discussions)
- 📝 [Changelog](https://github.com/boombertz/sdk-tinyerp/blob/main/CHANGELOG.md)

## Licença

Este projeto é um SDK não oficial e não possui afiliação com o TinyERP ou Olist.

Lançado sob a licença MIT.
