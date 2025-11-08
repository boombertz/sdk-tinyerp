import { TinyV2HttpClient } from "./http-client.js";
import { TinyApiError } from "./errors/tiny-api-error.js";

import { AccountResource } from "./resources/account.js";
import { ContactsResource } from "./resources/contacts.js";

import type { AccountDetails } from "./types/account.ts";

/**
 * Classe principal do SDK do Tiny ERP.
 * Ponto de entrada para todas as interações com a API v2.
 */
export class TinySDK {
  private httpClient: TinyV2HttpClient;

  public readonly account: AccountResource;
  public readonly contact: ContactsResource;

  /**
   * Cria uma nova instância do SDK.
   * @param token O seu API token do Tiny ERP (v2).
   */
  constructor(token: string) {
    this.httpClient = new TinyV2HttpClient(token);

    this.account = new AccountResource(this.httpClient);
    this.contact = new ContactsResource(this.httpClient);
  }
}

export { TinyApiError };
export type { AccountDetails };
