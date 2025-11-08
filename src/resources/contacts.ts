import type { TinyV2HttpClient } from "../http-client.ts";
import type {
  ContactSearchOptions,
  ContactSearchSuccessResponse,
  PaginatedContactsResponse,
  Contact,
} from "../types/contacts.ts";

/**
 * Classe que representa o recurso "Contatos" (Clientes e Fornecedores).
 */
export class ContactsResource {
  private readonly http: TinyV2HttpClient;

  constructor(httpClient: TinyV2HttpClient) {
    this.http = httpClient;
  }

  /**
   * Pesquisa contatos (clientes ou fornecedores).
   * Corresponde ao endpoint: /contatos.pesquisa.php
   *
   * @param pesquisa Nome ou código (ou parte) do contato.
   * @param options Um objeto com os filtros de pesquisa opcionais.
   * @returns Uma promessa (Promise) que resolve com a lista de contatos e dados de paginação.
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
}
