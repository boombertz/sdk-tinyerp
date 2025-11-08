/**
 * Detalhes completos da conta TinyERP.
 *
 * Contém as informações cadastrais da empresa/conta no TinyERP,
 * incluindo dados fiscais, endereço e contato.
 *
 * @example
 * ```typescript
 * const account = await sdk.account.getInfo();
 * console.log(`Empresa: ${account.razao_social}`);
 * console.log(`CNPJ: ${account.cnpj_cpf}`);
 * ```
 */
export interface AccountDetails {
  /** Razão social da empresa */
  razao_social: string;

  /** CNPJ (14 dígitos) ou CPF (11 dígitos) */
  cnpj_cpf: string;

  /** Nome fantasia da empresa */
  fantasia: string;

  /** Logradouro do endereço */
  endereco: string;

  /** Número do endereço */
  numero: string;

  /** Bairro */
  bairro: string;

  /** Complemento do endereço */
  complemento: string;

  /** Nome da cidade */
  cidade: string;

  /** Sigla do estado (UF) */
  estado: string;

  /** CEP no formato 12345-678 */
  cep: string;

  /** Telefone de contato */
  fone: string;

  /** E-mail principal da empresa */
  email: string;

  /** Inscrição Estadual */
  inscricao_estadual: string;

  /** Regime tributário da empresa (ex: Simples Nacional, Lucro Presumido, etc.) */
  regime_tributario: string;
}

/**
 * Resposta de sucesso da API ao obter informações da conta.
 *
 * Esta interface representa a estrutura retornada pela API do TinyERP
 * no endpoint /info.php quando a requisição é bem-sucedida.
 *
 * @internal Esta interface é usada internamente pelo SDK
 */
export interface InfoSuccessResponse {
  /** Status de processamento da API (conforme documentação do TinyERP) */
  status_processamento: number;

  /** Status da resposta: sempre "OK" em caso de sucesso */
  status: "OK";

  /** Objeto contendo os detalhes da conta */
  conta: AccountDetails;
}
