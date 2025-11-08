/**
 * Interface que representa os dados da conta.
 * Baseado na estrutura `retorno.conta` da API v2.
 */
export interface AccountDetails {
  razao_social: string;
  cnpj_cpf: string;
  fantasia: string;
  endereco: string;
  numero: string;
  bairro: string;
  complemento: string;
  cidade: string;
  estado: string;
  cep: string;
  fone: string;
  email: string;
  inscricao_estadual: string;
  regime_tributario: string;
}

/**
 * Representa a resposta de SUCESSO completa do endpoint /api2/info.php.
 * O nosso HttpClient irá retornar esta estrutura.
 */
export interface InfoSuccessResponse {
  /** Conforme tabela "Status de Processamento" */
  status_processamento: number;
  /** Contém o status do retorno “OK” */
  status: "OK";
  /** Elemento utilizado para representar a conta. */
  conta: AccountDetails;
}
