# SDK TinyERP (Unofficial)

[![npm version](https://img.shields.io/npm/v/sdk-tinyerp.svg)](https://www.npmjs.com/package/sdk-tinyerp)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Documentation](https://img.shields.io/badge/docs-VitePress-brightgreen.svg)](https://boombertz.github.io/sdk-tinyerp/)
[![License](https://img.shields.io/npm/l/sdk-tinyerp.svg)](LICENSE)

SDK não oficial para a API v2 do TinyERP (Olist), desenvolvido em TypeScript com suporte completo a tipos.

**📚 [Ver Documentação Completa](https://boombertz.github.io/sdk-tinyerp/)**

---

## 🚀 Características

- **TypeScript Nativo** - Totalmente tipado com mais de 1.500 linhas de definições
- **Zero Dependências** - Usa apenas APIs nativas do Node.js
- **ES Modules** - Suporte completo a ESM para projetos modernos
- **Testado** - Cobertura completa de testes com Vitest
- **Bem Documentado** - JSDoc detalhado em todos os métodos e tipos
- **Tratamento de Erros** - Classe customizada que preserva detalhes da API

## 📦 Instalação

```bash
npm install sdk-tinyerp
```

**Requisitos:** Node.js >= 18

## ⚡ Início Rápido

```typescript
import TinySDK from 'sdk-tinyerp';

// Inicializar SDK
const sdk = new TinySDK(process.env.TINY_API_TOKEN);

// Obter informações da conta
const account = await sdk.account.getInfo();
console.log('Empresa:', account.razao_social);

// Pesquisar produtos
const products = await sdk.product.search('notebook', {
  situacao: 'A',  // Apenas ativos
  pagina: 1
});

console.log(`Encontrados ${products.produtos.length} produtos`);

// Criar contato
const result = await sdk.contact.create([
  {
    sequencia: 1,
    contato: {
      nome: 'João Silva',
      tipo_pessoa: 'F',
      cpf_cnpj: '12345678901',
      email: 'joao@example.com'
    }
  }
]);

if (result[0].status === 'OK') {
  console.log('Contato criado com ID:', result[0].id);
}
```

**📖 [Ver mais exemplos na documentação](https://boombertz.github.io/sdk-tinyerp/getting-started/quick-start)**

## 📚 Recursos Disponíveis

| Resource | Métodos | Documentação |
|----------|---------|--------------|
| **Account** | `getInfo()` | [Ver docs](https://boombertz.github.io/sdk-tinyerp/resources/account) |
| **Contacts** | `search()`, `getById()`, `create()`, `update()` | [Ver docs](https://boombertz.github.io/sdk-tinyerp/resources/contacts) |
| **Products** | `search()`, `getById()`, `create()` | [Ver docs](https://boombertz.github.io/sdk-tinyerp/resources/products) |

## 🔗 Documentação

- **[Getting Started](https://boombertz.github.io/sdk-tinyerp/getting-started/installation)** - Instalação, autenticação e primeiros passos
- **[Resources](https://boombertz.github.io/sdk-tinyerp/resources/account)** - Documentação completa de cada resource
- **[Guias](https://boombertz.github.io/sdk-tinyerp/guides/error-handling)** - Tratamento de erros, paginação, operações em lote
- **[API Reference](https://boombertz.github.io/sdk-tinyerp/api/)** - Documentação gerada automaticamente

## 🛠️ Desenvolvimento

### Instalar dependências

```bash
npm install
```

### Scripts disponíveis

```bash
npm run build          # Compilar TypeScript
npm run dev            # Modo de desenvolvimento (watch)
npm test               # Executar testes
npm run test:watch     # Testes em modo watch
npm run docs:dev       # Servidor de documentação local
npm run docs:build     # Build da documentação
```

### Executar testes

```bash
npm test
```

Os testes cobrem:
- ✅ Sucesso e falha nas requisições
- ✅ Tratamento de erros da API
- ✅ Transformação de dados (wrapping/unwrapping)
- ✅ Validação de payloads

## 🗺️ Roadmap

- [x] Account (Conta)
- [x] Contacts (Contatos)
- [x] Products (Produtos)
- [ ] Orders (Pedidos)
- [ ] Invoices (Notas Fiscais)
- [ ] Stock (Estoque)
- [ ] Financial (Financeiro)
- [ ] Webhooks

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças seguindo [Conventional Commits](https://www.conventionalcommits.org/)
4. Abra um Pull Request

**Diretrizes:**
- Mantenha a cobertura de testes
- Adicione JSDoc para novos métodos
- Siga o estilo de código existente
- Atualize a documentação quando necessário

## 📄 Licença

Este projeto é um SDK não oficial e não possui afiliação com o TinyERP ou Olist.

Lançado sob a licença ISC.

## 🔗 Links

- [Documentação](https://boombertz.github.io/sdk-tinyerp/)
- [npm](https://www.npmjs.com/package/sdk-tinyerp)
- [GitHub](https://github.com/boombertz/sdk-tinyerp)
- [Issues](https://github.com/boombertz/sdk-tinyerp/issues)
- [Changelog](https://github.com/boombertz/sdk-tinyerp/blob/main/CHANGELOG.md)
- [API TinyERP](https://api.tiny.com.br/)

---

<div align="center">

**Feito com ❤️ para a comunidade de desenvolvedores**

[Reportar Bug](https://github.com/boombertz/sdk-tinyerp/issues) · [Sugerir Feature](https://github.com/boombertz/sdk-tinyerp/issues) · [Ver Documentação](https://boombertz.github.io/sdk-tinyerp/)

</div>
