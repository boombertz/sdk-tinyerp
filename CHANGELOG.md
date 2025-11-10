# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [1.0.0] - 2024-01-08

### Adicionado

#### Core
- SDK principal (`TinySDK`) com suporte a TypeScript
- Cliente HTTP (`TinyV2HttpClient`) para comunicação com a API v2
- Classe de erro customizada (`TinyApiError`) com detalhes da API
- Suporte completo a ES Modules (ESM)
- Zero dependências externas (usa apenas APIs nativas do Node.js)

#### Resources

**Account (Conta)**
- `AccountResource.getInfo()` - Obtém informações da conta/empresa
- Tipos completos para `AccountDetails`

**Contacts (Contatos)**
- `ContactsResource.search()` - Pesquisa contatos com filtros opcionais
- `ContactsResource.getById()` - Obtém detalhes completos de um contato
- `ContactsResource.create()` - Criação em lote de contatos
- `ContactsResource.update()` - Atualização em lote de contatos
- Tipos completos para todas as operações de contatos

#### Tipos TypeScript
- `ContactSearchOptions` - Parâmetros de pesquisa
- `Contact` - Contato resumido (pesquisa)
- `ContactDetails` - Contato completo (detalhes)
- `ContactCreateInput` - Dados para criação
- `ContactUpdateInput` - Dados para atualização
- `ContactCreateEntry` - Entrada em lote para criação
- `ContactUpdateEntry` - Entrada em lote para atualização
- `ContactCreateResultRecord` - Resultado de operações em lote
- `PessoaContato` - Pessoa de contato associada
- `PaginatedContactsResponse` - Resposta paginada de pesquisa
- `AccountDetails` - Detalhes da conta

#### Testes
- Suite de testes com Vitest
- Testes para `AccountResource.getInfo()`
- Testes completos para `ContactsResource` (search, getById, create, update)
- Cobertura de casos de sucesso e erro
- Mocking de requisições HTTP

#### Documentação
- README.md completo com exemplos de uso
- JSDoc detalhado em todos os arquivos
- Exemplos práticos de código
- Guia de desenvolvimento e contribuição
- CHANGELOG.md para rastreamento de versões

#### Configuração
- TypeScript configurado com modo estrito
- Build scripts para desenvolvimento e produção
- Configuração de testes com Vitest
- ESLint e Prettier (configuração básica)
- Gitignore configurado

### Características Técnicas

- **Wrapping/Unwrapping**: Transforma automaticamente as respostas "sujas" da API em interfaces limpas
- **Tratamento de Erros**: Captura e converte erros da API em `TinyApiError`
- **Tipagem Forte**: Todos os métodos e respostas são totalmente tipados
- **Paginação**: Suporte a resultados paginados na pesquisa de contatos
- **Batch Operations**: Criação e atualização em lote de contatos

## [1.0.3] - 2025-01-09

### Adicionado

#### Resources

**Products (Produtos)**
- `ProductsResource.search()` - Pesquisa produtos com filtros avançados
- `ProductsResource.getById()` - Obtém detalhes completos de um produto
- `ProductsResource.create()` - Criação em lote de produtos
- Suporte a produtos simples, variações, kits, estruturas e etapas de fabricação
- Mapeamentos de e-commerce para produtos e variações
- Imagens externas e anexos para produtos

#### Tipos TypeScript
- `Product` - Produto resumido (pesquisa)
- `ProductDetails` - Produto completo (detalhes)
- `ProductCreateInput` - Dados para criação de produtos
- `ProductCreateEntry` - Entrada em lote para criação
- `ProductCreateResultRecord` - Resultado de operações em lote
- `ProductsSearchOptions` - Parâmetros de pesquisa com filtros
- `PaginatedProductsResponse` - Resposta paginada de pesquisa
- `Variacao`, `ItemKit`, `ItemEstrutura`, `Etapa` - Tipos para componentes de produtos
- `MapeamentoEcommerce` - Mapeamentos de plataformas de e-commerce
- `ImagemExterna`, `Anexo` - Tipos para mídia de produtos
- 25+ interfaces completas com JSDoc detalhado

#### Testes
- Suite completa de testes para `ProductsResource`
- Testes para search(), getById() e create()
- Cobertura de produtos simples, com variações, kits e lotes
- Validação de wrapping/unwrapping de dados complexos

### Alterado

- Integrado `ProductsResource` no SDK principal (`sdk.product`)
- Limpeza de imports não utilizados em `ContactsResource`
- Configuração do TypeScript para excluir arquivos de teste (`**/*.test.ts`) do build

## [1.0.2] - 2024-01-08

### Alterado

- Atualização de metadados do repositório no package.json (homepage, bugs, repository)

## [1.0.1] - 2024-01-08

### Corrigido

- Correção da URL do repositório no package.json

## [1.0.0] - 2024-01-08

### Adicionado

#### Core
- SDK principal (`TinySDK`) com suporte a TypeScript
- Cliente HTTP (`TinyV2HttpClient`) para comunicação com a API v2
- Classe de erro customizada (`TinyApiError`) com detalhes da API
- Suporte completo a ES Modules (ESM)
- Zero dependências externas (usa apenas APIs nativas do Node.js)

#### Resources

**Account (Conta)**
- `AccountResource.getInfo()` - Obtém informações da conta/empresa
- Tipos completos para `AccountDetails`

**Contacts (Contatos)**
- `ContactsResource.search()` - Pesquisa contatos com filtros opcionais
- `ContactsResource.getById()` - Obtém detalhes completos de um contato
- `ContactsResource.create()` - Criação em lote de contatos
- `ContactsResource.update()` - Atualização em lote de contatos
- Tipos completos para todas as operações de contatos

#### Tipos TypeScript
- `ContactSearchOptions` - Parâmetros de pesquisa
- `Contact` - Contato resumido (pesquisa)
- `ContactDetails` - Contato completo (detalhes)
- `ContactCreateInput` - Dados para criação
- `ContactUpdateInput` - Dados para atualização
- `ContactCreateEntry` - Entrada em lote para criação
- `ContactUpdateEntry` - Entrada em lote para atualização
- `ContactCreateResultRecord` - Resultado de operações em lote
- `PessoaContato` - Pessoa de contato associada
- `PaginatedContactsResponse` - Resposta paginada de pesquisa
- `AccountDetails` - Detalhes da conta

#### Testes
- Suite de testes com Vitest
- Testes para `AccountResource.getInfo()`
- Testes completos para `ContactsResource` (search, getById, create, update)
- Cobertura de casos de sucesso e erro
- Mocking de requisições HTTP

#### Documentação
- README.md completo com exemplos de uso
- JSDoc detalhado em todos os arquivos
- Exemplos práticos de código
- Guia de desenvolvimento e contribuição
- CHANGELOG.md para rastreamento de versões

#### Configuração
- TypeScript configurado com modo estrito
- Build scripts para desenvolvimento e produção
- Configuração de testes com Vitest
- ESLint e Prettier (configuração básica)
- Gitignore configurado

### Características Técnicas

- **Wrapping/Unwrapping**: Transforma automaticamente as respostas "sujas" da API em interfaces limpas
- **Tratamento de Erros**: Captura e converte erros da API em `TinyApiError`
- **Tipagem Forte**: Todos os métodos e respostas são totalmente tipados
- **Paginação**: Suporte a resultados paginados na pesquisa de contatos
- **Batch Operations**: Criação e atualização em lote de contatos

## [Unreleased]

### Planejado

- [ ] Resource de Pedidos
- [ ] Resource de Notas Fiscais
- [ ] Resource de Estoque
- [ ] Resource de Financeiro
- [ ] Suporte a Webhooks
- [ ] Retry automático em caso de falhas
- [ ] Cache de requisições
- [ ] Logging configurável
- [ ] Modo de desenvolvimento/produção
- [ ] Interceptors de requisição/resposta

---

## Notas de Versão

### Sobre a v1.0.0

Esta é a primeira versão estável do SDK não oficial do TinyERP. Ela implementa os recursos básicos essenciais:

- ✅ Gerenciamento de conta
- ✅ Gerenciamento completo de contatos (CRUD)
- ✅ Tipagem TypeScript completa
- ✅ Testes unitários
- ✅ Documentação abrangente

O SDK está pronto para uso em produção, mas ainda não implementa todos os recursos da API do TinyERP. Recursos adicionais serão adicionados em versões futuras conforme a demanda.

### Breaking Changes

Nenhuma breaking change planejada para versões futuras até a v2.0.0.

### Depreciações

Nenhuma API está marcada como depreciada nesta versão.

---

[1.0.3]: https://github.com/seu-usuario/sdk-tinyerp/releases/tag/v1.0.3
[1.0.2]: https://github.com/seu-usuario/sdk-tinyerp/releases/tag/v1.0.2
[1.0.1]: https://github.com/seu-usuario/sdk-tinyerp/releases/tag/v1.0.1
[1.0.0]: https://github.com/seu-usuario/sdk-tinyerp/releases/tag/v1.0.0
[Unreleased]: https://github.com/seu-usuario/sdk-tinyerp/compare/v1.0.3...HEAD
