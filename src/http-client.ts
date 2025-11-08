import { TinyApiError } from "./errors/tiny-api-error.js";

const API_V2_BASE_URL = "https://api.tiny.com.br/api2";

/**
 * Interface interna para definir as opções de uma requisição.
 */
interface RequestOptions {
  method: "GET" | "POST";
  params?: Record<string, any>; // Para filtros em GET
  body?: Record<string, any>; // Para dados em POST
}

/**
 * Interface interna para a estrutura básica da resposta da API.
 */
type TinyApiResponse = {
  retorno: {
    status: "OK" | "Erro";
    [key: string]: any; // Permite outras propriedades (codigo_erro, pedido, etc.)
  };
};

/**
 * Cliente HTTP responsável por toda a comunicação com a API v2 do Tiny ERP.
 *
 * Abstrai a lógica de autenticação (token na URL) e a gestão de erros
 * (erros com status 200), convertendo-os em exceções (TinyApiError).
 */
export class TinyV2HttpClient {
  private readonly token: string;
  private readonly baseUrl: string = API_V2_BASE_URL;

  /**
   * Cria uma nova instância do cliente da API v2.
   * @param token O seu API token do Tiny ERP.
   */
  constructor(token: string) {
    if (!token) {
      throw new Error(
        "O API token é obrigatório para instanciar o TinyV2HttpClient."
      );
    }
    this.token = token;
  }

  /**
   * Executa uma requisição GET para um endpoint da API.
   * @param endpoint O caminho do endpoint (ex: /produto.pesquisar.php)
   * @param params Um objeto com os parâmetros de busca (ex: { id: 123 })
   */
  public async get(endpoint: string, params: Record<string, any> = {}) {
    return this.request(endpoint, {
      method: "GET",
      params,
    });
  }

  /**
   * Executa uma requisição POST para um endpoint da API.
   * @param endpoint O caminho do endpoint (ex: /contato.incluir.php)
   * @param body Um objeto com os dados a serem enviados.
   */
  public async post(endpoint: string, body: Record<string, any>) {
    return this.request(endpoint, {
      method: "POST",
      body,
    });
  }

  /**
   * Executa uma requisição POST para um endpoint da API.
   * @param endpoint O caminho do endpoint (ex: /contato.incluir.php)
   * @param options Um objeto com o método e os dados a serem enviados.
   */
  private async request(endpoint: string, options: RequestOptions) {
    // 1. Construir a URL base e adicionar parâmetros de autenticação
    const url = new URL(this.baseUrl + endpoint);
    url.searchParams.append("token", this.token);
    url.searchParams.append("formato", "json");

    // 2. Preparar as opções da requisição (fetch)
    const fetchOptions: RequestInit = {
      method: options.method,
    };

    // 3. Adicionar parâmetros/corpo dependendo do método
    if (options.method === "GET" && options.params) {
      // Adiciona parâmetros de busca (ex: { id: 123 }) à URL
      Object.entries(options.params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    if (options.method === "POST" && options.body) {
      // A API v2 do Tiny espera dados de formulário (não JSON) no corpo.
      // Usamos URLSearchParams para formatar o corpo como 'application/x-www-form-urlencoded'
      const bodyParams = new URLSearchParams();
      Object.entries(options.body).forEach(([key, value]) => {
        bodyParams.append(key, String(value));
      });

      fetchOptions.body = bodyParams;
      fetchOptions.headers = {
        "Content-Type": "application/x-www-form-urlencoded",
      };
    }

    // 4. Tentar executar a requisição
    let response: Response;
    try {
      response = await fetch(url.toString(), fetchOptions);
    } catch (networkError) {
      // Erro de rede (ex: sem internet, DNS falhou)
      console.error("Erro de rede ao contactar a API Tiny:", networkError);
      throw new Error(
        `Falha de rede ao tentar aceder ${url.toString()}. ${
          (networkError as Error).message
        }`
      );
    }

    // 5. Tentar analisar o JSON da resposta
    let data: TinyApiResponse;
    try {
      data = (await response.json()) as TinyApiResponse;
    } catch (jsonError) {
      // A API retornou algo que não é JSON (ex: um erro 500 com HTML)
      throw new Error(
        `A API Tiny retornou uma resposta inválida (não-JSON). Status: ${response.status}`
      );
    }

    // 6. Verificar o status da API (a lógica de negócio)
    // Este é o ponto-chave: a API retorna 200 OK mesmo para erros de negócio.
    if (data.retorno.status === "Erro") {
      // Se for um erro, lançamos o nosso erro personalizado.
      // O 'as any' é seguro aqui, pois TinyApiError espera essa estrutura.
      throw new TinyApiError(data.retorno as any);
    }

    return data.retorno;
  }
}
