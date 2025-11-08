/**
 * Interface que representa um único erro retornado pela API v2.
 * Ex: { "erro": "Pedido não localizado" }
 */
interface ApiErrorDetail {
  erro: string;
}

/**
 * Representa a estrutura completa de um erro vindo da API v2.
 */
interface ApiErrorResponse {
  status_processamento: string | number;
  codigo_erro: string | number;
  erros: ApiErrorDetail[];
}

/**
 * Erro personalizado para falhas da API v2 do Tiny ERP.
 *
 * Esta classe estende o `Error` padrão do JavaScript, mas adiciona
 * propriedades específicas da API, como `codigo` e `erros`,
 * para que o utilizador do SDK possa tratar os erros de forma programática.
 */
export class TinyApiError extends Error {
  /** O código de erro retornado pela API (ex: 32). */
  public readonly codigo: string | number;

  /** O status de processamento retornado pela API (ex: 2). */
  public readonly statusProcessamento: string | number;

  /** O array de erros detalhados. */
  public readonly erros: ApiErrorDetail[];

  constructor(errorResponse: ApiErrorResponse) {
    const primaryErrorMessage =
      errorResponse.erros && errorResponse.erros[0]
        ? errorResponse.erros[0].erro
        : "Ocorreu um erro desconhecido na API do Tiny.";

    super(primaryErrorMessage);

    this.name = "TinyApiError";

    this.codigo = errorResponse.codigo_erro;
    this.statusProcessamento = errorResponse.status_processamento;
    this.erros = errorResponse.erros;

    Object.setPrototypeOf(this, TinyApiError.prototype);
  }
}
