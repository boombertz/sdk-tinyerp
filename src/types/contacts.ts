/**
 * Parâmetros opcionais para pesquisa de contatos via API do TinyERP.
 *
 * Permite filtrar a busca de contatos usando diversos critérios.
 * Todos os parâmetros são opcionais e podem ser combinados.
 *
 * @example
 * ```typescript
 * // Buscar contatos ativos criados em uma data específica
 * const options: ContactSearchOptions = {
 *   situacao: "Ativo",
 *   dataCriacao: "01/01/2024",
 *   pagina: 1
 * };
 * ```
 */
export interface ContactSearchOptions {
  /** CPF (11 dígitos) ou CNPJ (14 dígitos) para filtrar a busca */
  cpf_cnpj?: string;

  /** ID do vendedor associado ao contato */
  idVendedor?: number;

  /** Nome do vendedor associado ao contato */
  nomeVendedor?: string;

  /** Situação do contato: "Ativo" ou "Excluido" */
  situacao?: "Ativo" | "Excluido";

  /** Número da página para resultados paginados (começa em 1) */
  pagina?: number;

  /** Data de criação do contato no formato DD/MM/YYYY */
  dataCriacao?: string;

  /** Data mínima de atualização do contato no formato DD/MM/YYYY */
  dataMinimaAtualizacao?: string;
}

/**
 * Representa um contato resumido retornado pela pesquisa de contatos.
 *
 * Esta interface contém as informações básicas de um contato retornadas
 * pelo endpoint de pesquisa. Para obter todos os detalhes de um contato,
 * use o método `getById()`.
 *
 * @see ContactDetails Para a versão completa com todos os campos
 */
export interface Contact {
  /** ID único do contato no TinyERP */
  id: number;

  /** Código customizado do contato (definido pelo usuário) */
  codigo: string;

  /** Nome completo ou razão social */
  nome: string;

  /** Nome fantasia (para pessoas jurídicas) */
  fantasia: string;

  /** Tipo de pessoa: F (Física), J (Jurídica), E (Estrangeiro) */
  tipo_pessoa: "F" | "J" | "E";

  /** CPF (11 dígitos) ou CNPJ (14 dígitos) */
  cpf_cnpj: string;

  /** Logradouro (rua, avenida, etc.) */
  endereco: string;

  /** Número do endereço */
  numero: string;

  /** Complemento do endereço (apto, sala, etc.) */
  complemento: string;

  /** Bairro */
  bairro: string;

  /** CEP no formato 12345-678 */
  cep: string;

  /** Nome da cidade */
  cidade: string;

  /** Unidade Federativa (sigla do estado, ex: SP, RJ) */
  uf: string;

  /** Endereço de e-mail principal */
  email: string;

  /** Telefone de contato */
  fone: string;

  /** ID da lista de preço associada ao contato */
  id_lista_preco: number;

  /** ID do vendedor responsável */
  id_vendedor: number;

  /** Nome do vendedor responsável */
  nome_vendedor: string;

  /** Situação do contato: "Ativo" ou "Excluido" */
  situacao: "Ativo" | "Excluido";

  /** Data de criação do contato no formato DD/MM/YYYY */
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

/**
 * Resposta paginada de pesquisa de contatos (versão limpa).
 *
 * Esta interface representa a resposta transformada pelo SDK,
 * sem os wrappers extras da API.
 */
export interface PaginatedContactsResponse {
  /** Array de contatos retornados na pesquisa */
  contatos: Contact[];

  /** Número da página atual */
  pagina: number;

  /** Número total de páginas disponíveis */
  numero_paginas: number;
}

/**
 * Representa uma pessoa de contato associada a um cliente/fornecedor.
 *
 * Permite cadastrar múltiplas pessoas dentro de uma mesma empresa,
 * cada uma com suas próprias informações de contato.
 */
export interface PessoaContato {
  /** ID único da pessoa de contato */
  id_pessoa: number;

  /** Nome completo da pessoa de contato */
  nome: string;

  /** Telefone da pessoa de contato */
  telefone: string;

  /** Ramal telefônico */
  ramal: string;

  /** E-mail da pessoa de contato */
  email: string;

  /** Departamento ou setor da pessoa na empresa */
  departamento: string;
}

/**
 * Interface "suja" (da API) para o wrapper de PessoaContato
 */
interface ApiPessoaContatoWrapper {
  pessoa_contato: PessoaContato;
}

/**
 * Interface "suja" (da API) para o wrapper de TipoContato
 */
interface ApiTipoContato {
  tipo: string;
}

/**
 * Detalhes completos de um contato retornado pelo método `getById()`.
 *
 * Esta interface contém todas as informações disponíveis de um contato,
 * incluindo dados pessoais, endereços, informações fiscais e relacionamentos.
 *
 * @see Contact Para a versão resumida retornada pela pesquisa
 */
export interface ContactDetails {
  /** ID único do contato no TinyERP */
  id: number;

  /** Código customizado do contato */
  codigo: string;

  /** Nome completo ou razão social */
  nome: string;

  /** Nome fantasia (para pessoas jurídicas) */
  fantasia: string;

  /** Tipo de pessoa: F (Física), J (Jurídica), E (Estrangeiro) */
  tipo_pessoa: "F" | "J" | "E";

  /** CPF (11 dígitos) ou CNPJ (14 dígitos) */
  cpf_cnpj: string;

  /** Inscrição Estadual */
  ie: string;

  /** RG (para pessoa física) */
  rg: string;

  /** Inscrição Municipal */
  im: string;

  /** Logradouro do endereço principal */
  endereco: string;

  /** Número do endereço principal */
  numero: string;

  /** Complemento do endereço principal */
  complemento: string;

  /** Bairro do endereço principal */
  bairro: string;

  /** CEP do endereço principal */
  cep: string;

  /** Cidade do endereço principal */
  cidade: string;

  /** UF do endereço principal */
  uf: string;

  /** País do endereço principal */
  pais: string;

  /** Logradouro do endereço de cobrança (opcional) */
  endereco_cobranca?: string;

  /** Número do endereço de cobrança (opcional) */
  numero_cobranca?: string;

  /** Complemento do endereço de cobrança (opcional) */
  complemento_cobranca?: string;

  /** Bairro do endereço de cobrança (opcional) */
  bairro_cobranca?: string;

  /** CEP do endereço de cobrança (opcional) */
  cep_cobranca?: string;

  /** Cidade do endereço de cobrança (opcional) */
  cidade_cobranca?: string;

  /** UF do endereço de cobrança (opcional) */
  uf_cobranca?: string;

  /** Campo de texto livre para contatos adicionais */
  contatos: string;

  /** Telefone principal */
  fone: string;

  /** Fax */
  fax: string;

  /** Telefone celular */
  celular: string;

  /** E-mail principal */
  email: string;

  /** E-mail para envio de notas fiscais eletrônicas */
  email_nfe: string;

  /** Website */
  site: string;

  /** Código de Regime Tributário */
  crt: string;

  /** Estado civil (código numérico) */
  estadoCivil?: number;

  /** Profissão */
  profissao?: string;

  /** Sexo: "masculino" ou "feminino" */
  sexo?: "masculino" | "feminino";

  /** Data de nascimento no formato DD/MM/YYYY */
  data_nascimento?: string;

  /** Naturalidade (cidade de nascimento) */
  naturalidade?: string;

  /** Nome do pai */
  nome_pai?: string;

  /** CPF do pai */
  cpf_pai?: string;

  /** Nome da mãe */
  nome_mae?: string;

  /** CPF da mãe */
  cpf_mae?: string;

  /** Limite de crédito em reais */
  limite_credito?: number;

  /** Situação: A (Ativo), E (Excluído), I (Inativo), S (Suspenso) */
  situacao: "A" | "E" | "I" | "S";

  /** Observações gerais */
  obs: string;

  /** ID da lista de preço associada */
  id_lista_preco: number;

  /** ID do vendedor responsável */
  id_vendedor: number;

  /** Nome do vendedor responsável */
  nome_vendedor: string;

  /** Data de criação do registro no formato DD/MM/YYYY */
  data_criacao: string;

  /** Data da última atualização no formato DD/MM/YYYY */
  data_atualizacao: string;

  /** Tipos de contato (Cliente, Fornecedor, etc.) */
  tipos_contato: string[];

  /** Lista de pessoas de contato associadas */
  pessoas_contato: PessoaContato[];
}

/**
 * Interface que representa a RESPOSTA DA API (com invólucros).
 */
type ApiContactDetails = Omit<
  ContactDetails,
  "tipos_contato" | "pessoas_contato"
> & {
  tipos_contato: ApiTipoContato[];
  pessoas_contato: ApiPessoaContatoWrapper[];
};

/**
 * Representa a resposta de SUCESSO completa do endpoint /contato.obter.php
 */
export interface ContactGetSuccessResponse {
  status_processamento: number;
  status: "OK";
  contato: ApiContactDetails;
}

/**
 * Dados de entrada para criar/atualizar uma pessoa de contato.
 *
 * Usado nos métodos `create()` e `update()` de contatos.
 */
export interface PessoaContatoCreateInput {
  /** Nome completo da pessoa de contato (obrigatório) */
  nome: string;

  /** Telefone da pessoa de contato */
  telefone?: string;

  /** Ramal telefônico */
  ramal?: string;

  /** E-mail da pessoa de contato */
  email?: string;

  /** Departamento ou setor */
  departamento?: string;
}

/**
 * Dados de entrada para criar um novo contato.
 *
 * Esta interface define os campos necessários para criar um contato.
 * O SDK transformará estes dados para o formato esperado pela API do TinyERP.
 *
 * @example
 * ```typescript
 * const novoContato: ContactCreateInput = {
 *   nome: "João Silva",
 *   situacao: "A",
 *   tipo_pessoa: "F",
 *   cpf_cnpj: "12345678901",
 *   email: "joao@example.com",
 *   fone: "11999999999"
 * };
 * ```
 */
export interface ContactCreateInput {
  /** Nome completo ou razão social (obrigatório) */
  nome: string;

  /** Situação: A (Ativo), I (Inativo), S (Suspenso) */
  situacao: "A" | "I" | "S";

  /** Código customizado do contato */
  codigo?: string;

  /** Nome fantasia (para pessoas jurídicas) */
  fantasia?: string;

  /** Tipo de pessoa: F (Física), J (Jurídica), E (Estrangeiro) */
  tipo_pessoa?: "F" | "J" | "E";

  /** CPF (11 dígitos) ou CNPJ (14 dígitos) */
  cpf_cnpj?: string;

  /** Inscrição Estadual */
  ie?: string;

  /** RG (para pessoa física) */
  rg?: string;

  /** Inscrição Municipal */
  im?: string;

  /** Logradouro do endereço */
  endereco?: string;

  /** Número do endereço */
  numero?: string;

  /** Complemento do endereço */
  complemento?: string;

  /** Bairro */
  bairro?: string;

  /** CEP no formato 12345-678 */
  cep?: string;

  /** Cidade */
  cidade?: string;

  /** UF (sigla do estado) */
  uf?: string;

  /** País */
  pais?: string;

  /** Logradouro do endereço de cobrança */
  endereco_cobranca?: string;

  /** Número do endereço de cobrança */
  numero_cobranca?: string;

  /** Complemento do endereço de cobrança */
  complemento_cobranca?: string;

  /** Bairro do endereço de cobrança */
  bairro_cobranca?: string;

  /** CEP do endereço de cobrança */
  cep_cobranca?: string;

  /** Cidade do endereço de cobrança */
  cidade_cobranca?: string;

  /** UF do endereço de cobrança */
  uf_cobranca?: string;

  /** Contatos adicionais (texto livre) */
  contatos?: string;

  /** Telefone principal */
  fone?: string;

  /** Fax */
  fax?: string;

  /** Telefone celular */
  celular?: string;

  /** E-mail principal */
  email?: string;

  /** E-mail para envio de NFe */
  email_nfe?: string;

  /** Website */
  site?: string;

  /** Código de Regime Tributário: 0 (Simples), 1 (Simples Excess), 3 (Regime Normal) */
  crt?: 0 | 1 | 3;

  /** Estado civil (código numérico) */
  estadoCivil?: number;

  /** Profissão */
  profissao?: string;

  /** Sexo */
  sexo?: "masculino" | "feminino";

  /** Data de nascimento no formato DD/MM/YYYY */
  data_nascimento?: string;

  /** Naturalidade */
  naturalidade?: string;

  /** Nome do pai */
  nome_pai?: string;

  /** CPF do pai */
  cpf_pai?: string;

  /** Nome da mãe */
  nome_mae?: string;

  /** CPF da mãe */
  cpf_mae?: string;

  /** Limite de crédito em reais */
  limite_credito?: number;

  /** ID do vendedor responsável */
  id_vendedor?: number;

  /** Nome do vendedor responsável */
  nome_vendedor?: string;

  /** Observações */
  obs?: string;

  /** Contribuinte ICMS: 0 (Não), 1 (Sim), 2 (Isento), 9 (Não informado) */
  contribuint?: 0 | 1 | 2 | 9;

  /** Tipos de contato (ex: ["Cliente", "Fornecedor"]) */
  tipos_contato?: string[];

  /** Lista de pessoas de contato a serem cadastradas */
  pessoas_contato?: PessoaContatoCreateInput[];
}

/**
 * Entrada individual para criação em lote de contatos.
 *
 * Ao criar múltiplos contatos em uma única chamada, cada contato
 * deve ter uma sequência única para identificação dos resultados.
 *
 * @example
 * ```typescript
 * const entries: ContactCreateEntry[] = [
 *   {
 *     sequencia: 1,
 *     data: { nome: "João Silva", situacao: "A" }
 *   },
 *   {
 *     sequencia: 2,
 *     data: { nome: "Maria Santos", situacao: "A" }
 *   }
 * ];
 * ```
 */
export interface ContactCreateEntry {
  /** Número sequencial único para identificar este contato no resultado */
  sequencia: number;

  /** Dados do contato a ser criado */
  data: ContactCreateInput;
}

/**
 * Interface que representa um único erro no array `erros`.
 */
interface ApiErrorDetail {
  erro: string;
}

/**
 * Resultado da criação/atualização de um contato individual.
 *
 * Retornado após operações de criação ou atualização em lote,
 * permitindo verificar o sucesso ou erro de cada contato.
 *
 * @example
 * ```typescript
 * // Exemplo de resultado bem-sucedido
 * {
 *   sequencia: 1,
 *   status: "OK",
 *   id: 12345
 * }
 *
 * // Exemplo de resultado com erro
 * {
 *   sequencia: 2,
 *   status: "Erro",
 *   codigo_erro: 123,
 *   erros: [{ erro: "CPF inválido" }]
 * }
 * ```
 */
export interface ContactCreateResultRecord {
  /** Número sequencial correspondente à entrada enviada */
  sequencia: number;

  /** Status da operação: "OK" para sucesso, "Erro" para falha */
  status: "OK" | "Erro";

  /** ID do contato criado/atualizado (apenas se status = "OK") */
  id?: number;

  /** Código do erro (apenas se status = "Erro") */
  codigo_erro?: number;

  /** Detalhes dos erros ocorridos (apenas se status = "Erro") */
  erros?: ApiErrorDetail[];
}

/**
 * O invólucro "sujo" que a API retorna.
 */
interface ApiCreateRecordWrapper {
  registro: ContactCreateResultRecord;
}

/**
 * Representa a resposta de SUCESSO completa do /contato.incluir.php
 * (baseado em `retorno`)
 */
export interface ContactCreateSuccessResponse {
  status_processamento: number;
  status: "OK";
  registros: ApiCreateRecordWrapper[];
}

/**
 * Dados de entrada para atualizar um contato existente.
 *
 * Similar ao ContactCreateInput, mas requer ID ou código para identificar
 * qual contato será atualizado. Apenas os campos fornecidos serão atualizados.
 *
 * @example
 * ```typescript
 * const atualizacao: ContactUpdateInput = {
 *   id: 12345,
 *   nome: "João Silva Atualizado",
 *   situacao: "A",
 *   email: "joao.novo@example.com"
 * };
 * ```
 */
export interface ContactUpdateInput {
  /** Nome completo ou razão social (obrigatório) */
  nome: string;

  /** Situação: A (Ativo), I (Inativo), S (Suspenso) */
  situacao: "A" | "I" | "S";

  /** ID do contato a ser atualizado (ID ou código deve ser fornecido) */
  id?: number;

  /** Código do contato a ser atualizado (ID ou código deve ser fornecido) */
  codigo?: string;

  /** CPF ou CNPJ */
  cpf_cnpj?: string;

  /** Nome fantasia */
  fantasia?: string;

  /** Tipo de pessoa */
  tipo_pessoa?: "F" | "J" | "E";

  /** Inscrição Estadual */
  ie?: string;

  /** RG */
  rg?: string;

  /** Inscrição Municipal */
  im?: string;

  /** Logradouro */
  endereco?: string;

  /** Número do endereço */
  numero?: string;

  /** Complemento */
  complemento?: string;

  /** Bairro */
  bairro?: string;

  /** CEP */
  cep?: string;

  /** Cidade */
  cidade?: string;

  /** UF */
  uf?: string;

  /** País */
  pais?: string;

  /** Endereço de cobrança */
  endereco_cobranca?: string;

  /** Número do endereço de cobrança */
  numero_cobranca?: string;

  /** Complemento do endereço de cobrança */
  complemento_cobranca?: string;

  /** Bairro do endereço de cobrança */
  bairro_cobranca?: string;

  /** CEP do endereço de cobrança */
  cep_cobranca?: string;

  /** Cidade do endereço de cobrança */
  cidade_cobranca?: string;

  /** UF do endereço de cobrança */
  uf_cobranca?: string;

  /** Contatos adicionais */
  contatos?: string;

  /** Telefone */
  fone?: string;

  /** Fax */
  fax?: string;

  /** Celular */
  celular?: string;

  /** E-mail */
  email?: string;

  /** E-mail para NFe */
  email_nfe?: string;

  /** Website */
  site?: string;

  /** Código de Regime Tributário */
  crt?: 0 | 1 | 3;

  /** Estado civil */
  estadoCivil?: number;

  /** Profissão */
  profissao?: string;

  /** Sexo */
  sexo?: "masculino" | "feminino";

  /** Data de nascimento */
  data_nascimento?: string;

  /** Naturalidade */
  naturalidade?: string;

  /** Nome do pai */
  nome_pai?: string;

  /** CPF do pai */
  cpf_pai?: string;

  /** Nome da mãe */
  nome_mae?: string;

  /** CPF da mãe */
  cpf_mae?: string;

  /** Limite de crédito */
  limite_credito?: number;

  /** ID do vendedor */
  id_vendedor?: number;

  /** Nome do vendedor */
  nome_vendedor?: string;

  /** Observações */
  obs?: string;

  /** Tipos de contato */
  tipos_contato?: string[];

  /** Pessoas de contato */
  pessoas_contato?: PessoaContatoCreateInput[];
}

/**
 * Entrada individual para atualização em lote de contatos.
 *
 * Similar ao ContactCreateEntry, permite atualizar múltiplos
 * contatos em uma única chamada à API.
 */
export interface ContactUpdateEntry {
  /** Número sequencial único para identificar este contato no resultado */
  sequencia: number;

  /** Dados do contato a ser atualizado */
  data: ContactUpdateInput;
}
