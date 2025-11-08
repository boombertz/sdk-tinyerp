/**
 * Define os parâmetros de pesquisa opcionais para o endpoint de contatos.
 */
export interface ContactSearchOptions {
  cpf_cnpj?: string;
  idVendedor?: number;
  nomeVendedor?: string;
  situacao?: "Ativo" | "Excluido";
  pagina?: number;
  dataCriacao?: string;
  dataMinimaAtualizacao?: string;
}

/**
 * Representa o objeto de um único contato, como retornado pela API.
 * (Baseado em `retorno.contatos[].contato`)
 */
export interface Contact {
  id: number;
  codigo: string;
  nome: string;
  fantasia: string;
  tipo_pessoa: "F" | "J" | "E";
  cpf_cnpj: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cep: string;
  cidade: string;
  uf: string;
  email: string;
  fone: string;
  id_lista_preco: number;
  id_vendedor: number;
  nome_vendedor: string;
  situacao: "Ativo" | "Excluido";
  data_criacao: string;
}

/**
 * A API do Tiny envolve o contato num objeto "contato".
 * (Representa `retorno.contatos[]`)
 */
interface ContactWrapper {
  contato: Contact;
}

/**
 * Representa a resposta de SUCESSO completa do endpoint /contatos.pesquisa.php.
 * (Representa o objeto `retorno` completo)
 */
export interface ContactSearchSuccessResponse {
  status_processamento: number;
  status: "OK";
  pagina: number;
  numero_paginas: number;
  contatos: ContactWrapper[];
}

export interface PaginatedContactsResponse {
  contatos: Contact[];
  pagina: number;
  numero_paginas: number;
}
