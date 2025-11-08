import type { TinyV2HttpClient } from "../http-client.ts";
import type { AccountDetails, InfoSuccessResponse } from "../types/account.ts";

/**
 * Classe que representa o recurso "Conta" da API v2.
 * Agrupa todos os endpoints relacionados à conta.
 */
export class AccountResource {
  private readonly http: TinyV2HttpClient;

  /**
   * Cria uma instância do AccountResource.
   * @param httpClient O cliente HTTP a ser usado para as requisições.
   */
  constructor(httpClient: TinyV2HttpClient) {
    this.http = httpClient;
  }

  /**
   * Obtém as informações da conta vinculada ao token.
   * Corresponde ao endpoint: /api2/info.php
   *
   * @returns Uma promessa (Promise) que resolve com os dados da conta.
   */
  public async getInfo(): Promise<AccountDetails> {
    const response = await this.http.get("/info.php");

    const typedResponse = response as InfoSuccessResponse;
    return typedResponse.conta;
  }
}
