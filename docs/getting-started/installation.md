# Instalação

## Requisitos

Antes de instalar o SDK TinyERP, certifique-se de que seu ambiente atende aos seguintes requisitos:

- **Node.js** >= 18.0.0 (para suporte a `fetch` nativo)
- **npm**, **yarn**, ou **pnpm** (gerenciador de pacotes)
- **TypeScript** >= 5.0 (opcional, mas recomendado)

::: tip Dica
O SDK utiliza a API `fetch` nativa do Node.js, que está disponível a partir da versão 18. Se você estiver usando uma versão anterior, considere atualizar para aproveitar ao máximo o SDK.
:::

## Instalação via NPM

Instale o SDK usando seu gerenciador de pacotes favorito:

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

## Verificação da Instalação

Após a instalação, você pode verificar se o SDK foi instalado corretamente criando um arquivo de teste:

```typescript
// test-sdk.ts
import TinySDK from 'sdk-tinyerp';

console.log('SDK TinyERP instalado com sucesso!');
console.log('Versão:', require('sdk-tinyerp/package.json').version);
```

Execute o arquivo:

```bash
node test-sdk.ts
```

Se tudo estiver correto, você verá a mensagem de sucesso e a versão do SDK.

## Configuração TypeScript

Se você estiver usando TypeScript, certifique-se de que seu `tsconfig.json` está configurado corretamente para ES Modules:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "esModuleInterop": true,
    "strict": true
  }
}
```

::: info ES Modules
O SDK TinyERP é distribuído como ES Module (ESM). Certifique-se de que seu projeto suporta ESM ou configure adequadamente.
:::

## Estrutura de Pacotes

Após a instalação, o SDK estará disponível com a seguinte estrutura:

```
node_modules/sdk-tinyerp/
├── dist/
│   ├── index.js           # Ponto de entrada principal
│   ├── index.d.ts         # Definições TypeScript
│   ├── resources/         # Resources (Account, Contacts, Products)
│   ├── types/             # Tipos TypeScript
│   └── errors/            # Classe TinyApiError
├── package.json
└── README.md
```

## Dependências

Uma das grandes vantagens do SDK TinyERP é que ele possui **zero dependências externas**. Tudo é implementado usando apenas APIs nativas do Node.js:

- ✅ `fetch` nativo para requisições HTTP
- ✅ `URL` e `URLSearchParams` para manipulação de URLs
- ✅ Apenas TypeScript como devDependency

Isso significa:
- 📦 Pacote extremamente leve
- 🔒 Menos superfície de ataque para vulnerabilidades
- ⚡ Instalação mais rápida
- 🚀 Menos conflitos de versão

## Problemas Comuns

### Erro: Cannot find module 'sdk-tinyerp'

Se você encontrar este erro, verifique:

1. O pacote foi instalado corretamente? Execute `npm list sdk-tinyerp`
2. Você está usando o caminho de import correto? Deve ser `import TinySDK from 'sdk-tinyerp'`

### Erro: fetch is not defined

Este erro indica que você está usando uma versão do Node.js anterior à 18. Atualize para Node.js 18 ou superior:

```bash
# Verifique sua versão atual
node --version

# Se for menor que 18, atualize
# Use nvm (recomendado):
nvm install 18
nvm use 18
```

### Problemas com ESM

Se você estiver enfrentando problemas com ES Modules, certifique-se de:

1. Adicionar `"type": "module"` no seu `package.json`, ou
2. Usar extensão `.mjs` nos seus arquivos, ou
3. Configurar seu bundler (webpack, vite, etc.) para suportar ESM

## Próximos Passos

Agora que o SDK está instalado, você precisa:

1. [Configurar a autenticação](/getting-started/authentication) com seu token do TinyERP
2. [Fazer sua primeira requisição](/getting-started/quick-start) com o SDK
3. [Explorar os resources disponíveis](/resources/account)

## Atualizações

Para atualizar o SDK para a versão mais recente:

::: code-group

```bash [npm]
npm update sdk-tinyerp
```

```bash [yarn]
yarn upgrade sdk-tinyerp
```

```bash [pnpm]
pnpm update sdk-tinyerp
```

:::

Verifique o [Changelog](https://github.com/seu-usuario/sdk-tinyerp/blob/main/CHANGELOG.md) para ver o que mudou entre versões.
