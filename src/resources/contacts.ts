import type { TinyV2HttpClient } from "../http-client.ts";
import type {
  ContactSearchOptions,
  ContactSearchSuccessResponse,
  PaginatedContactsResponse,
  Contact,
  ContactDetails,
  ContactGetSuccessResponse,
  ContactCreateInput,
  ContactCreateEntry,
  PessoaContatoCreateInput,
  ContactCreateSuccessResponse,
  ContactCreateResultRecord,
  ContactUpdateEntry,
} from "../types/contacts.ts";

/**
 * Resource para gerenciamento de contatos (clientes e fornecedores).
 *
 * Esta classe fornece métodos para pesquisar, obter, criar e atualizar
 * contatos no TinyERP. Todos os métodos interagem com a API v2 do TinyERP.
 *
 * @example
 * ```typescript
 * const sdk = new TinySDK('seu-token');
 *
 * // Pesquisar contatos
 * const results = await sdk.contact.search('João');
 *
 * // Obter detalhes de um contato
 * const contact = await sdk.contact.getById(12345);
 *
 * // Criar novo contato
 * await sdk.contact.create([{
 *   sequencia: 1,
 *   data: { nome: "Novo Cliente", situacao: "A" }
 * }]);
 * ```
 */
export class ContactsResource {
  private readonly http: TinyV2HttpClient;

  /**
   * Cria uma instância do ContactsResource.
   *
   * @param httpClient Cliente HTTP configurado com o token da API
   * @internal
   */
  constructor(httpClient: TinyV2HttpClient) {
    this.http = httpClient;
  }

  /**
   * Pesquisa contatos por nome ou código.
   *
   * Busca contatos (clientes/fornecedores) usando texto livre e filtros opcionais.
   * Os resultados são paginados e podem ser refinados usando diversos critérios.
   *
   * **Endpoint:** `POST /contatos.pesquisa.php`
   *
   * @param pesquisa - Termo de busca (nome, código ou parte deles). Pode ser vazio para listar todos
   * @param options - Filtros opcionais para refinar a busca (CPF/CNPJ, situação, vendedor, etc.)
   * @returns Promessa que resolve com lista de contatos e informações de paginação
   *
   * @throws {TinyApiError} Quando a API retorna erro (ex: token inválido, parâmetros incorretos)
   *
   * @example
   * ```typescript
   * // Busca simples por nome
   * const results = await sdk.contact.search('João');
   * console.log(`Encontrados ${results.contatos.length} contatos`);
   *
   * // Busca com filtros
   * const activeContacts = await sdk.contact.search('', {
   *   situacao: 'Ativo',
   *   pagina: 1,
   *   dataCriacao: '01/01/2024'
   * });
   *
   * // Buscar por CPF/CNPJ
   * const byDocument = await sdk.contact.search('', {
   *   cpf_cnpj: '12345678901'
   * });
   * ```
   */
  public async search(
    pesquisa: string,
    options: ContactSearchOptions = {}
  ): Promise<PaginatedContactsResponse> {
    const params = {
      pesquisa,
      ...options,
    };

    const response = await this.http.get("/contatos.pesquisa.php", params);

    const typedResponse = response as ContactSearchSuccessResponse;

    const contatos: Contact[] = typedResponse.contatos.map(
      (item) => item.contato
    );

    return {
      contatos: contatos,
      pagina: typedResponse.pagina,
      numero_paginas: typedResponse.numero_paginas,
    };
  }

  /**
   * Obtém os detalhes completos de um contato específico.
   *
   * Retorna todas as informações disponíveis de um contato, incluindo
   * endereços completos, dados fiscais, pessoas de contato associadas, etc.
   *
   * **Endpoint:** `POST /contato.obter.php`
   *
   * @param id - ID único do contato no TinyERP
   * @returns Promessa que resolve com os detalhes completos do contato
   *
   * @throws {TinyApiError} Quando o contato não existe ou há erro na API
   *
   * @example
   * ```typescript
   * const contact = await sdk.contact.getById(12345);
   *
   * console.log(`Nome: ${contact.nome}`);
   * console.log(`Email: ${contact.email}`);
   * console.log(`Endereço: ${contact.endereco}, ${contact.numero}`);
   *
   * // Acessar pessoas de contato
   * contact.pessoas_contato.forEach(pessoa => {
   *   console.log(`Contato: ${pessoa.nome} - ${pessoa.email}`);
   * });
   *
   * // Verificar tipos de contato
   * console.log('Tipos:', contact.tipos_contato); // ["Cliente", "Fornecedor"]
   * ```
   */
  public async getById(id: number): Promise<ContactDetails> {
    const response = await this.http.get("/contato.obter.php", { id });
    const typedResponse = response as ContactGetSuccessResponse;

    const contatoApi = typedResponse.contato;

    // Desembrulha os tipos de contato (remove wrapper da API)
    const tiposLimpos = contatoApi.tipos_contato.map((item) => item.tipo);

    // Desembrulha as pessoas de contato (remove wrapper da API)
    const pessoasLimpas = contatoApi.pessoas_contato.map(
      (item) => item.pessoa_contato
    );

    return {
      ...contatoApi,
      tipos_contato: tiposLimpos,
      pessoas_contato: pessoasLimpas,
    };
  }
  /**
   * Cria um ou mais contatos em lote.
   *
   * Permite criar múltiplos contatos em uma única requisição.
   * Cada contato deve ter um número sequencial único para identificação
   * dos resultados. O método retorna o status individual de cada criação.
   *
   * **Endpoint:** `POST /contato.incluir.php`
   *
   * @param contacts - Array de contatos a serem criados, cada um com sequencia e dados
   * @returns Promessa que resolve com array de resultados (um para cada contato)
   *
   * @throws {TinyApiError} Quando há erro geral na API (ex: token inválido)
   *
   * @example
   * ```typescript
   * // Criar um único contato
   * const result = await sdk.contact.create([
   *   {
   *     sequencia: 1,
   *     data: {
   *       nome: "João Silva",
   *       situacao: "A",
   *       tipo_pessoa: "F",
   *       cpf_cnpj: "12345678901",
   *       email: "joao@example.com",
   *       fone: "11999999999"
   *     }
   *   }
   * ]);
   *
   * if (result[0].status === "OK") {
   *   console.log(`Contato criado com ID: ${result[0].id}`);
   * } else {
   *   console.error('Erros:', result[0].erros);
   * }
   *
   * // Criar múltiplos contatos
   * const results = await sdk.contact.create([
   *   { sequencia: 1, data: { nome: "Cliente 1", situacao: "A" } },
   *   { sequencia: 2, data: { nome: "Cliente 2", situacao: "A" } }
   * ]);
   *
   * results.forEach(r => {
   *   console.log(`Sequencia ${r.sequencia}: ${r.status}`);
   * });
   * ```
   */
  public async create(
    contacts: ContactCreateEntry[]
  ): Promise<ContactCreateResultRecord[]> {
    const apiPayload = {
      contatos: contacts.map((entry) => {
        const { data, sequencia } = entry;

        const wrappedTipos = data.tipos_contato
          ? data.tipos_contato.map((t) => ({ tipo: t }))
          : [];

        const wrappedPessoas = data.pessoas_contato
          ? data.pessoas_contato.map((p) => ({ pessoa_contato: p }))
          : [];

        return {
          contato: {
            ...data,
            sequencia,
            tipos_contato: wrappedTipos,
            pessoas_contato: wrappedPessoas,
          },
        };
      }),
    };

    const body = {
      contato: JSON.stringify(apiPayload),
    };

    const response = await this.http.post("/contato.incluir.php", body);

    const typedResponse = response as ContactCreateSuccessResponse;

    const cleanResults = typedResponse.registros.map((r) => r.registro);

    return cleanResults;
  }

  /**
   * Atualiza um ou mais contatos existentes em lote.
   *
   * Permite atualizar múltiplos contatos em uma única requisição.
   * Cada contato deve incluir ID ou código para identificação, além
   * dos campos a serem atualizados. Apenas os campos fornecidos serão alterados.
   *
   * **Endpoint:** `POST /contato.alterar.php`
   *
   * @param contacts - Array de contatos a serem atualizados, cada um com sequencia e dados
   * @returns Promessa que resolve com array de resultados (um para cada contato)
   *
   * @throws {TinyApiError} Quando há erro geral na API (ex: token inválido)
   *
   * @example
   * ```typescript
   * // Atualizar um único contato
   * const result = await sdk.contact.update([
   *   {
   *     sequencia: 1,
   *     data: {
   *       id: 12345,
   *       nome: "João Silva Atualizado",
   *       situacao: "A",
   *       email: "joao.novo@example.com"
   *     }
   *   }
   * ]);
   *
   * if (result[0].status === "OK") {
   *   console.log(`Contato atualizado com sucesso`);
   * } else {
   *   console.error('Erros:', result[0].erros);
   * }
   *
   * // Atualizar múltiplos contatos
   * const results = await sdk.contact.update([
   *   {
   *     sequencia: 1,
   *     data: { id: 123, nome: "Nome Atualizado 1", situacao: "A" }
   *   },
   *   {
   *     sequencia: 2,
   *     data: { id: 456, nome: "Nome Atualizado 2", situacao: "A" }
   *   }
   * ]);
   * ```
   */
  public async update(
    contacts: ContactUpdateEntry[]
  ): Promise<ContactCreateResultRecord[]> {
    const apiPayload = {
      contatos: contacts.map((entry) => {
        const { data, sequencia } = entry;

        const wrappedTipos = data.tipos_contato
          ? data.tipos_contato.map((t) => ({ tipo: t }))
          : [];

        const wrappedPessoas = data.pessoas_contato
          ? data.pessoas_contato.map((p) => ({ pessoa_contato: p }))
          : [];

        return {
          contato: {
            ...data,
            sequencia,
            tipos_contato: wrappedTipos,
            pessoas_contato: wrappedPessoas,
          },
        };
      }),
    };

    const body = {
      contato: JSON.stringify(apiPayload),
    };

    const response = await this.http.post("/contato.alterar.php", body);

    const typedResponse = response as ContactCreateSuccessResponse;

    const cleanResults = typedResponse.registros.map((r) => r.registro);

    return cleanResults;
  }
}
