import type { TinyV2HttpClient } from "../http-client.ts";
import type { AccountDetails, InfoSuccessResponse } from "../types/account.ts";

/**
 * Resource para gerenciamento de informações da conta.
 *
 * Esta classe fornece acesso às informações cadastrais da conta
 * (empresa) vinculada ao token de autenticação da API.
 *
 * @example
 * ```typescript
 * const sdk = new TinySDK('seu-token');
 * const accountInfo = await sdk.account.getInfo();
 * console.log(`Empresa: ${accountInfo.razao_social}`);
 * ```
 */
export class AccountResource {
  private readonly http: TinyV2HttpClient;

  /**
   * Cria uma instância do AccountResource.
   *
   * @param httpClient - Cliente HTTP configurado com o token da API
   * @internal
   */
  constructor(httpClient: TinyV2HttpClient) {
    this.http = httpClient;
  }

  /**
   * Obtém as informações da conta vinculada ao token de autenticação.
   *
   * Retorna os dados cadastrais completos da empresa/conta no TinyERP,
   * incluindo razão social, CNPJ/CPF, endereço, contato e informações fiscais.
   *
   * **Endpoint:** `POST /info.php`
   *
   * @returns Promessa que resolve com os detalhes completos da conta
   *
   * @throws {TinyApiError} Quando há erro na API (ex: token inválido ou expirado)
   *
   * @example
   * ```typescript
   * try {
   *   const account = await sdk.account.getInfo();
   *
   *   console.log('Razão Social:', account.razao_social);
   *   console.log('CNPJ/CPF:', account.cnpj_cpf);
   *   console.log('Email:', account.email);
   *   console.log('Telefone:', account.fone);
   *   console.log('Regime Tributário:', account.regime_tributario);
   *
   *   // Endereço completo
   *   const endereco = `${account.endereco}, ${account.numero}`;
   *   console.log('Endereço:', endereco);
   *   console.log('Cidade/UF:', `${account.cidade}/${account.estado}`);
   * } catch (error) {
   *   if (error instanceof TinyApiError) {
   *     console.error('Erro da API:', error.message);
   *   }
   * }
   * ```
   */
  public async getInfo(): Promise<AccountDetails> {
    const response = await this.http.get("/info.php");

    const typedResponse = response as InfoSuccessResponse;
    return typedResponse.conta;
  }
}
