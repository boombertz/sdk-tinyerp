import { TinyV2HttpClient } from "./http-client.js";
import { TinyApiError } from "./errors/tiny-api-error.js";

import { AccountResource } from "./resources/account.js";
import { ContactsResource } from "./resources/contacts.js";
import { ProductsResource } from "./resources/products.js";

import type { AccountDetails } from "./types/account.ts";

/**
 * SDK não oficial para a API v2 do TinyERP (Olist).
 *
 * Esta é a classe principal do SDK que fornece acesso a todos os recursos
 * da API do TinyERP através de uma interface TypeScript totalmente tipada.
 *
 * @example
 * ```typescript
 * import TinySDK from 'sdk-tinyerp';
 *
 * // Inicializar o SDK com seu token
 * const sdk = new TinySDK('seu-token-da-api');
 *
 * // Obter informações da conta
 * const account = await sdk.account.getInfo();
 * console.log('Empresa:', account.razao_social);
 *
 * // Pesquisar contatos
 * const contacts = await sdk.contact.search('João');
 * console.log('Contatos encontrados:', contacts.contatos.length);
 *
 * // Obter detalhes de um contato
 * const contact = await sdk.contact.getById(12345);
 *
 * // Criar novo contato
 * await sdk.contact.create([{
 *   sequencia: 1,
 *   data: {
 *     nome: "Novo Cliente",
 *     situacao: "A",
 *     email: "cliente@example.com"
 *   }
 * }]);
 * ```
 *
 * @see {@link https://api.tiny.com.br/ Documentação oficial da API TinyERP}
 */
export class TinySDK {
  private httpClient: TinyV2HttpClient;

  /**
   * Resource para operações relacionadas à conta/empresa.
   *
   * Permite obter informações cadastrais da conta vinculada ao token.
   *
   * @example
   * ```typescript
   * const accountInfo = await sdk.account.getInfo();
   * ```
   */
  public readonly account: AccountResource;

  /**
   * Resource para gerenciamento de contatos (clientes e fornecedores).
   *
   * Permite pesquisar, obter, criar e atualizar contatos.
   *
   * @example
   * ```typescript
   * // Pesquisar
   * const results = await sdk.contact.search('João');
   *
   * // Obter por ID
   * const contact = await sdk.contact.getById(123);
   *
   * // Criar
   * await sdk.contact.create([...]);
   *
   * // Atualizar
   * await sdk.contact.update([...]);
   * ```
   */
  public readonly contact: ContactsResource;

  public readonly product: ProductsResource;

  /**
   * Cria uma nova instância do SDK TinyERP.
   *
   * O token de autenticação pode ser obtido no painel administrativo
   * do TinyERP em Configurações > API.
   *
   * @param token - Token de autenticação da API v2 do TinyERP
   *
   * @throws {TinyApiError} Nos métodos do SDK quando há erros da API
   *
   * @example
   * ```typescript
   * const sdk = new TinySDK('seu-token-aqui');
   * ```
   */
  constructor(token: string) {
    this.httpClient = new TinyV2HttpClient(token);

    this.account = new AccountResource(this.httpClient);
    this.contact = new ContactsResource(this.httpClient);
    this.product = new ProductsResource(this.httpClient);
  }
}

// Exportações nomeadas para facilitar o uso
export { TinyApiError };
export type { AccountDetails };
