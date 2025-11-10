# Autenticação

O SDK TinyERP utiliza autenticação baseada em **token de API**. Este guia mostra como obter e usar seu token de forma segura.

## Obtendo seu Token

Para usar o SDK, você precisa de um token de acesso da API do TinyERP.

### Passo 1: Acesse o Painel TinyERP

1. Faça login na sua conta do TinyERP: [https://www.tiny.com.br/](https://www.tiny.com.br/)
2. No menu superior, vá em **Configurações** → **API**
3. Você verá seu **Token de API** na página

::: warning Atenção
Seu token de API é como uma senha - nunca o compartilhe ou exponha publicamente. Qualquer pessoa com acesso ao seu token pode fazer requisições em nome da sua conta.
:::

### Passo 2: Copie o Token

O token tem o formato de uma string alfanumérica longa. Exemplo fictício:

```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0
```

## Configurando o SDK

### Método Básico (não recomendado para produção)

A forma mais simples de usar o token é passá-lo diretamente no construtor:

```typescript
import TinySDK from "sdk-tinyerp";

const sdk = new TinySDK("seu-token-aqui");
```

::: danger Nunca faça isso em produção!
Nunca coloque seu token diretamente no código-fonte, especialmente se o código for versionado com Git. Use variáveis de ambiente!
:::

### Método Recomendado: Variáveis de Ambiente

#### 1. Crie um arquivo `.env`

Na raiz do seu projeto, crie um arquivo `.env`:

```bash
TINY_API_TOKEN=seu-token-aqui
```

#### 2. Adicione `.env` ao `.gitignore`

**Muito importante!** Certifique-se de que o arquivo `.env` não seja versionado:

```bash
# .gitignore
.env
.env.local
.env.*.local
```

#### 3. Use a biblioteca `dotenv` (Node.js)

Instale o `dotenv`:

```bash
npm install dotenv
```

Use no seu código:

```typescript
import "dotenv/config";
import TinySDK from "sdk-tinyerp";

const sdk = new TinySDK(process.env.TINY_API_TOKEN!);
```

#### 4. Para Projetos TypeScript

Para melhor suporte a tipos, crie um arquivo `env.d.ts`:

```typescript
// env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    TINY_API_TOKEN: string;
  }
}
```

Agora você terá autocomplete para `process.env.TINY_API_TOKEN`.

### Método para Deploy (Vercel, Netlify, etc.)

Para ambientes de produção em plataformas de cloud:

#### Vercel

```bash
# Via CLI
vercel env add TINY_API_TOKEN

# Ou no dashboard: Settings → Environment Variables
```

#### Netlify

```bash
# Via CLI
netlify env:set TINY_API_TOKEN seu-token-aqui

# Ou no dashboard: Site settings → Environment variables
```

#### AWS Lambda

Use AWS Systems Manager Parameter Store ou Secrets Manager:

```typescript
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";

const client = new SSMClient({ region: "us-east-1" });
const command = new GetParameterCommand({
  Name: "/myapp/tiny-api-token",
  WithDecryption: true,
});

const response = await client.send(command);
const token = response.Parameter?.Value;

const sdk = new TinySDK(token!);
```

## Validando o Token

Você pode validar se o token está funcionando fazendo uma requisição simples:

```typescript
import TinySDK from "sdk-tinyerp";

async function validateToken() {
  try {
    const sdk = new TinySDK(process.env.TINY_API_TOKEN!);
    const accountInfo = await sdk.account.getInfo();

    console.log("✅ Token válido!");
    console.log("Empresa:", accountInfo.razao_social);
    console.log("Email:", accountInfo.email);
  } catch (error) {
    console.error("❌ Token inválido ou erro na API");
    console.error(error);
  }
}

validateToken();
```

Se o token for válido, você receberá as informações da sua conta. Caso contrário, receberá um erro.

### 3. Nunca Exponha o Token no Frontend

::: danger Segurança Crítica
**NUNCA** envie o token para o navegador ou cliente. Sempre faça as requisições do lado do servidor (backend).
:::

Exemplo **ERRADO** ❌:

```javascript
// ❌ NÃO FAÇA ISSO - Frontend (React, Vue, etc.)
const sdk = new TinySDK("token-aqui"); // Token exposto!
```

Exemplo **CORRETO** ✅:

```javascript
// ✅ Backend (Node.js, API Route)
// pages/api/produtos.ts (Next.js)
export default async function handler(req, res) {
  const sdk = new TinySDK(process.env.TINY_API_TOKEN);
  const products = await sdk.product.search(req.query.term);
  res.json(products);
}

// ✅ Frontend (React)
// Faz requisição para SUA API, não diretamente para TinyERP
const response = await fetch("/api/produtos?term=notebook");
const products = await response.json();
```

## Tratamento de Erros de Autenticação

O SDK lançará um `TinyApiError` se o token for inválido:

```typescript
import TinySDK, { TinyApiError } from "sdk-tinyerp";

try {
  const sdk = new TinySDK(process.env.TINY_API_TOKEN!);
  const info = await sdk.account.getInfo();
} catch (error) {
  if (error instanceof TinyApiError) {
    if (error.codigo === "401" || error.message.includes("autenticação")) {
      console.error("Token inválido ou expirado");
      // Notifique admin, tente renovar token, etc.
    }
  }
  throw error;
}
```

## Próximos Passos

Agora que você configurou a autenticação:

1. [Faça sua primeira requisição](/getting-started/quick-start)
2. [Explore os Resources disponíveis](/resources/account)
3. [Aprenda sobre tratamento de erros](/guides/error-handling)
