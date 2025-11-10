/**
 * Representa o "Resumo do Produto" (Product Summary) retornado pelas rotas
 * de pesquisa. (Baseado em retorno.produtos[].produto)
 *
 * @interface Product
 * @property {number} id - Identificador único do produto
 * @property {string} nome - Nome/descrição do produto
 * @property {number} preco - Preço de venda do produto
 * @property {number} preco_promocional - Preço promocional do produto
 * @property {"N" | "P" | "V"} tipoVariacao - Tipo de variação: "N" (Normal/sem variação), "P" (Produto Pai), "V" (Variação)
 * @property {string} [codigo] - Código/SKU do produto
 * @property {number} [preco_custo] - Preço de custo do produto
 * @property {number} [preco_custo_medio] - Preço de custo médio calculado
 * @property {string} [unidade] - Unidade de medida (ex: "UN", "KG", "MT")
 * @property {string} [gtin] - Código GTIN/EAN do produto
 * @property {string} [localizacao] - Localização física do produto no estoque
 * @property {"A" | "I" | "E"} [situacao] - Situação do produto: "A" (Ativo), "I" (Inativo), "E" (Excluído)
 * @property {string} [data_criacao] - Data de criação do produto (formato ISO ou da API)
 */
export interface Product {
  id: number;
  nome: string;
  preco: number;
  preco_promocional: number;
  tipoVariacao: "N" | "P" | "V";
  codigo?: string;
  preco_custo?: number;
  preco_custo_medio?: number;
  unidade?: string;
  gtin?: string;
  localizacao?: string;
  situacao?: "A" | "I" | "E";
  data_criacao?: string;
}

/**
 * Opções de filtro e paginação para pesquisa de produtos.
 *
 * @interface ProductsSearchOptions
 * @property {number} [idTag] - Filtrar por ID da tag/categoria
 * @property {number} [idListaPreco] - Filtrar por ID da lista de preço
 * @property {number} [pagina] - Número da página para paginação (começa em 1)
 * @property {string} [gtin] - Filtrar por código GTIN/EAN
 * @property {"A" | "I" | "E"} [situacao] - Filtrar por situação: "A" (Ativo), "I" (Inativo), "E" (Excluído)
 * @property {string} [dataCriacao] - Filtrar por data de criação
 */
export interface ProductsSearchOptions {
  idTag?: number;
  idListaPreco?: number;
  pagina?: number;
  gtin?: string;
  situacao?: "A" | "I" | "E";
  dataCriacao?: string;
}

/**
 * Interface interna para o "invólucro" (wrapper) da API de pesquisa.
 * Usado internamente pelo SDK para deserializar a resposta da API.
 *
 * @interface ProductWrapper
 * @internal
 * @property {Product} produto - Objeto produto encapsulado
 */
interface ProductWrapper {
  produto: Product;
}

/**
 * Representa a resposta de SUCESSO completa do endpoint /produtos.pesquisa.php
 *
 * @interface ProductSearchSuccessResponse
 * @property {number} status_processamento - Código de status do processamento
 * @property {"OK"} status - Status da operação (sempre "OK" em caso de sucesso)
 * @property {number} pagina - Página atual dos resultados
 * @property {number} numero_paginas - Número total de páginas disponíveis
 * @property {ProductWrapper[]} produtos - Array de produtos encapsulados em wrappers
 */
export interface ProductSearchSuccessResponse {
  status_processamento: number;
  status: "OK";
  pagina: number;
  numero_paginas: number;
  produtos: ProductWrapper[];
}

/**
 * Esta é a interface "limpa" que o nosso método de pesquisa irá retornar.
 * Os produtos já vêm desencapsulados, prontos para uso.
 *
 * @interface PaginatedProductsResponse
 * @property {Product[]} produtos - Array de produtos (desencapsulados)
 * @property {number} pagina - Página atual dos resultados
 * @property {number} numero_paginas - Número total de páginas disponíveis
 */
export interface PaginatedProductsResponse {
  produtos: Product[];
  pagina: number;
  numero_paginas: number;
}

/**
 * Representa o mapeamento de uma variação de produto com plataformas de e-commerce.
 *
 * @interface ProductVariationMapping
 * @property {number} idEcommerce - ID da plataforma de e-commerce
 * @property {string} skuMapeamento - SKU da variação na plataforma de e-commerce
 * @property {string} skuMapeamentoPai - SKU do produto pai na plataforma de e-commerce
 * @property {number} idMapeamentoPai - ID do mapeamento do produto pai
 * @property {number} idMapeamento - ID do mapeamento da variação
 * @property {number} [preco] - Preço específico para esta plataforma
 * @property {number} [preco_promocional] - Preço promocional específico para esta plataforma
 */
export interface ProductVariationMapping {
  idEcommerce: number;
  skuMapeamento: string;
  skuMapeamentoPai: string;
  idMapeamentoPai: number;
  idMapeamento: number;
  preco?: number;
  preco_promocional?: number;
}

/**
 * Representa o mapeamento de um produto (não variação) com plataformas de e-commerce.
 *
 * @interface ProductMapping
 * @property {number} idEcommerce - ID da plataforma de e-commerce
 * @property {string} skuMapeamento - SKU do produto na plataforma de e-commerce
 * @property {number} idMapeamento - ID do mapeamento
 * @property {number} [preco] - Preço específico para esta plataforma
 * @property {number} [preco_promocional] - Preço promocional específico para esta plataforma
 */
export interface ProductMapping {
  idEcommerce: number;
  skuMapeamento: string;
  idMapeamento: number;
  preco?: number;
  preco_promocional?: number;
}

/**
 * Representa um item componente de um kit de produtos.
 *
 * @interface ProductKitItem
 * @property {number} id_produto - ID do produto que faz parte do kit
 * @property {number} quantidade - Quantidade deste produto no kit
 */
export interface ProductKitItem {
  id_produto: number;
  quantidade: number;
}

/**
 * Representa uma imagem externa associada ao produto.
 *
 * @interface ProductImageExternal
 * @property {string} url - URL completa da imagem externa
 */
export interface ProductImageExternal {
  url: string;
}

/**
 * Representa uma única variação de um produto (Interface "Limpa" do SDK).
 * Contém uma lista "limpa" de mapeamentos.
 *
 * @interface ProductVariation
 * @property {number} id - ID único da variação
 * @property {string} codigo - Código/SKU da variação
 * @property {number} [preco] - Preço específico da variação
 * @property {Record<string, string>} grade - Atributos da variação (ex: {"Cor": "Azul", "Tamanho": "G"})
 * @property {ProductVariationMapping[]} mapeamentos - Lista de mapeamentos com plataformas de e-commerce
 */
export interface ProductVariation {
  id: number;
  codigo: string;
  preco?: number;
  grade: Record<string, string>;
  mapeamentos: ProductVariationMapping[]; // <-- Lista "limpa"
}

/**
 * A interface principal para um Produto DETALHADO (Interface "Limpa" do SDK).
 * O método `getById` do SDK retornará esta interface.
 *
 * @interface ProductDetails
 * @property {number} id - Identificador único do produto
 * @property {string} [data_criacao] - Data de criação do produto
 * @property {string} nome - Nome/descrição do produto
 * @property {string} [codigo] - Código/SKU do produto
 * @property {string} [unidade] - Unidade de medida (ex: "UN", "KG", "MT")
 * @property {number} [preco] - Preço de venda do produto
 * @property {number} [preco_promocional] - Preço promocional do produto
 * @property {string} [ncm] - Nomenclatura Comum do Mercosul (código fiscal)
 * @property {string} [origem] - Origem do produto (0-Nacional, 1-Estrangeira importação direta, etc.)
 * @property {string} [gtin] - Código GTIN/EAN do produto
 * @property {string} [gtin_embalagem] - Código GTIN/EAN da embalagem
 * @property {string} [localizacao] - Localização física do produto no estoque
 * @property {number} [peso_liquido] - Peso líquido do produto em kg
 * @property {number} [peso_bruto] - Peso bruto do produto em kg
 * @property {number} [estoque_minimo] - Estoque mínimo desejado
 * @property {number} [estoque_maximo] - Estoque máximo desejado
 * @property {number} [id_fornecedor] - ID do fornecedor principal
 * @property {string} [codigo_fornecedor] - Código do produto no cadastro do fornecedor
 * @property {string} [codigo_pelo_fornecedor] - Código que o fornecedor usa para este produto
 * @property {string} [unidade_por_caixa] - Unidade de medida por caixa
 * @property {number} [preco_custo] - Preço de custo do produto
 * @property {number} [preco_custo_medio] - Preço de custo médio calculado
 * @property {"A" | "I"} situacao - Situação do produto: "A" (Ativo), "I" (Inativo)
 * @property {"P" | "S"} tipo - Tipo do produto: "P" (Produto), "S" (Serviço)
 * @property {string} [classe_ipi] - Classe de IPI
 * @property {number} [valor_ipi_fixo] - Valor fixo de IPI
 * @property {string} [cod_lista_servicos] - Código da lista de serviços
 * @property {string} [descricao_complementar] - Descrição complementar do produto
 * @property {string} [obs] - Observações sobre o produto
 * @property {string} [garantia] - Informações sobre garantia
 * @property {string} [cest] - Código Especificador da Substituição Tributária
 * @property {"N" | "P" | "V"} tipoVariacao - Tipo de variação: "N" (Normal), "P" (Produto Pai), "V" (Variação)
 * @property {number} [idProdutoPai] - ID do produto pai (quando este é uma variação)
 * @property {"S" | "N"} sob_encomenda - Indica se o produto é vendido sob encomenda
 * @property {number} [dias_preparacao] - Dias necessários para preparação/produção
 * @property {string} [marca] - Marca do produto
 * @property {1 | 2 | 3} [tipoEmbalagem] - Tipo de embalagem: 1 (Caixa/Pacote), 2 (Rolo/Cilindro), 3 (Envelope)
 * @property {number} [alturaEmbalagem] - Altura da embalagem em cm
 * @property {number} [larguraEmbalagem] - Largura da embalagem em cm
 * @property {number} [comprimentoEmbalagem] - Comprimento da embalagem em cm
 * @property {number} [diametroEmbalagem] - Diâmetro da embalagem em cm (para embalagens cilíndricas)
 * @property {string} [categoria] - Categoria do produto
 * @property {"S" | "K" | "V" | "F" | "M"} classe_produto - Classe: "S" (Simples), "K" (Kit), "V" (Variável), "F" (Fabricado), "M" (Matéria-prima)
 * @property {string} [seo_title] - Título SEO para e-commerce
 * @property {string} [seo_keywords] - Palavras-chave SEO
 * @property {string} [link_video] - URL do vídeo do produto
 * @property {string} [seo_description] - Descrição SEO
 * @property {string} [slug] - Slug para URL amigável
 * @property {Record<string, string>} grade - Atributos de grade (para variações)
 * @property {string[]} anexos - URLs de anexos/documentos
 * @property {ProductImageExternal[]} imagens_externas - Imagens externas do produto
 * @property {ProductKitItem[]} kit - Itens componentes (quando classe_produto="K")
 * @property {ProductMapping[]} mapeamentos - Mapeamentos com plataformas de e-commerce
 * @property {ProductVariation[]} variacoes - Variações do produto (quando tipoVariacao="P")
 */
export interface ProductDetails {
  id: number;
  data_criacao?: string;
  nome: string;
  codigo?: string;
  unidade?: string;
  preco?: number;
  preco_promocional?: number;
  ncm?: string;
  origem?: string;
  gtin?: string;
  gtin_embalagem?: string;
  localizacao?: string;
  peso_liquido?: number;
  peso_bruto?: number;
  estoque_minimo?: number;
  estoque_maximo?: number;
  id_fornecedor?: number;
  codigo_fornecedor?: string;
  codigo_pelo_fornecedor?: string;
  unidade_por_caixa?: string;
  preco_custo?: number;
  preco_custo_medio?: number;
  situacao: "A" | "I";
  tipo: "P" | "S";
  classe_ipi?: string;
  valor_ipi_fixo?: number;
  cod_lista_servicos?: string;
  descricao_complementar?: string;
  obs?: string;
  garantia?: string;
  cest?: string;
  tipoVariacao: "N" | "P" | "V";
  idProdutoPai?: number;
  sob_encomenda: "S" | "N";
  dias_preparacao?: number;
  marca?: string;
  tipoEmbalagem?: 1 | 2 | 3;
  alturaEmbalagem?: number;
  larguraEmbalagem?: number;
  comprimentoEmbalagem?: number;
  diametroEmbalagem?: number;
  categoria?: string;
  classe_produto: "S" | "K" | "V" | "F" | "M";
  seo_title?: string;
  seo_keywords?: string;
  link_video?: string;
  seo_description?: string;
  slug?: string;
  grade: Record<string, string>;
  anexos: string[];
  imagens_externas: ProductImageExternal[];
  kit: ProductKitItem[];
  mapeamentos: ProductMapping[];
  variacoes: ProductVariation[];
}

/**
 * Wrapper interno da API para mapeamentos de produto.
 * @internal
 */
interface ProductMappingWrapper {
  mapeamento: ProductMapping;
}

/**
 * Wrapper interno da API para itens de kit.
 * @internal
 */
interface ProductKitWrapper {
  item: ProductKitItem;
}

/**
 * Wrapper interno da API para imagens externas.
 * @internal
 */
interface ProductImageExternalWrapper {
  imagem_externa: ProductImageExternal;
}

/**
 * Wrapper interno da API para mapeamentos de variação.
 * @internal
 */
interface ProductVariationMappingWrapper {
  mapeamento: ProductVariationMapping;
}

/**
 * Interface "suja" para uma variação (como vem da API).
 * Usada internamente para deserialização.
 *
 * @internal
 */
interface ApiProductVariation {
  id: number;
  codigo: string;
  preco?: number;
  grade: Record<string, string>;
  mapeamentos: ProductVariationMappingWrapper[]; // <-- Lista "suja"
}

/**
 * Wrapper interno da API para variações.
 * @internal
 */
interface ApiProductVariationWrapper {
  variacao: ApiProductVariation;
}

/**
 * Wrapper interno da API para anexos.
 * @internal
 */
interface ApiProductAnexoWrapper {
  anexo: string;
}

/**
 * Interface "suja" para um Produto Detalhado (como vem da API).
 * Usa Omit<> para herdar campos e sobrescreve as listas com versões encapsuladas.
 * Usado internamente pelo SDK para deserialização.
 *
 * @internal
 */
type ApiProductDetails = Omit<
  ProductDetails,
  "anexos" | "imagens_externas" | "kit" | "mapeamentos" | "variacoes"
> & {
  anexos: ApiProductAnexoWrapper[];
  imagens_externas: ProductImageExternalWrapper[];
  kit: ProductKitWrapper[];
  mapeamentos: ProductMappingWrapper[];
  variacoes: ApiProductVariationWrapper[];
};

/**
 * Representa a resposta de SUCESSO "suja" do /produto.obter.php
 *
 * @interface ApiProductGetSuccessResponse
 * @property {number} status_processamento - Código de status do processamento
 * @property {"OK"} status - Status da operação (sempre "OK" em caso de sucesso)
 * @property {ApiProductDetails} produto - Dados do produto com estrutura "suja" (encapsulada)
 */
export interface ApiProductGetSuccessResponse {
  status_processamento: number;
  status: "OK";
  produto: ApiProductDetails; // <-- CORREÇÃO: Usa o tipo "sujo"
}

/**
 * Interface "limpa" para o input de SEO.
 * (Baseado em produtos[].produto.seo)
 *
 * @interface ProductSeoInput
 * @property {string} [seo_title] - Título otimizado para SEO
 * @property {string} [seo_keywords] - Palavras-chave para SEO
 * @property {string} [link_video] - URL do vídeo do produto
 * @property {string} [seo_description] - Descrição otimizada para SEO
 * @property {string} [slug] - Slug para URL amigável
 */
export interface ProductSeoInput {
  seo_title?: string;
  seo_keywords?: string;
  link_video?: string;
  seo_description?: string;
  slug?: string;
}

/**
 * Interface "limpa" para um item da estrutura.
 * (Baseado em produtos[].produto.estrutura[].item)
 *
 * @interface ProductStructureItemInput
 * @property {number} [id_produto] - ID do produto componente (informar id_produto OU codigo)
 * @property {string} [codigo] - Código do produto componente (informar id_produto OU codigo)
 * @property {string} descricao - Descrição do item na estrutura
 * @property {number} [quantidade] - Quantidade necessária do componente
 */
export interface ProductStructureItemInput {
  id_produto?: number;
  codigo?: string;
  descricao: string;
  quantidade?: number;
}

/**
 * Interface "limpa" para uma etapa de produção.
 * (Baseado em produtos[].produto.etapas[].etapa)
 *
 * @interface ProductProductionStageInput
 * @property {string} nome - Nome da etapa de produção
 */
export interface ProductProductionStageInput {
  nome: string;
}

/**
 * Interface "limpa" para o input de mapeamento de variação.
 * (Baseado em produtos[].produto.variacoes[].variacao.mapeamentos[].mapeamento)
 *
 * @interface ProductVariationMappingInput
 * @property {string} skuMapeamento - SKU da variação na plataforma de e-commerce
 * @property {string} skuMapeamentoPai - SKU do produto pai na plataforma de e-commerce
 * @property {number} [idEcommerce] - ID da plataforma de e-commerce
 * @property {string} [urlProduto] - URL do produto na plataforma
 * @property {string} [urlImagem] - URL da imagem do produto na plataforma
 */
export interface ProductVariationMappingInput {
  skuMapeamento: string;
  skuMapeamentoPai: string;
  idEcommerce?: number;
  urlProduto?: string;
  urlImagem?: string;
}

/**
 * Interface "limpa" para o input de mapeamento do produto principal.
 * (Baseado em produtos[].produto.mapeamentos[].mapeamento)
 *
 * @interface ProductMappingInput
 * @property {string} skuMapeamento - SKU do produto na plataforma de e-commerce
 * @property {number} [idEcommerce] - ID da plataforma de e-commerce
 * @property {string} [urlProduto] - URL do produto na plataforma
 * @property {string} [urlImagem] - URL da imagem do produto na plataforma
 */
export interface ProductMappingInput {
  skuMapeamento: string;
  idEcommerce?: number;
  urlProduto?: string;
  urlImagem?: string;
}

/**
 * Interface "limpa" para o input de uma variação.
 * (Baseado em produtos[].produto.variacoes[].variacao)
 *
 * @interface ProductVariationInput
 * @property {string} [codigo] - Código/SKU da variação
 * @property {number} [preco] - Preço específico da variação
 * @property {number} [preco_promocional] - Preço promocional específico da variação
 * @property {number} [estoque_atual] - Estoque atual da variação
 * @property {Record<string, string>} grade - Pares de chave/valor para os atributos da variação (ex: {"Cor": "Azul", "Tamanho": "G"})
 * @property {ProductVariationMappingInput[]} [mapeamentos] - Mapeamentos com plataformas de e-commerce
 */
export interface ProductVariationInput {
  codigo?: string;
  preco?: number;
  preco_promocional?: number;
  estoque_atual?: number;
  /** Pares de chave/valor, ex: { "Cor": "Azul", "Tamanho": "G" } */
  grade: Record<string, string>;
  mapeamentos?: ProductVariationMappingInput[];
}

/**
 * Interface "limpa" para os DADOS DE ENTRADA de um novo produto.
 * O nosso SDK irá "embrulhar" isto no formato da API.
 *
 * @interface ProductCreateInput
 *
 * @property {string} nome - Nome/descrição do produto (obrigatório)
 * @property {string} unidade - Unidade de medida (ex: "UN", "KG", "MT") (obrigatório)
 * @property {number} preco - Preço de venda do produto (obrigatório)
 * @property {string} origem - Origem do produto: "0" (Nacional), "1" (Estrangeira - importação direta), etc. (obrigatório)
 * @property {"A" | "I"} situacao - Situação do produto: "A" (Ativo), "I" (Inativo) (obrigatório)
 * @property {"P" | "S"} tipo - Tipo: "P" (Produto), "S" (Serviço) (obrigatório)
 *
 * @property {string} [codigo] - Código/SKU do produto
 * @property {number} [preco_promocional] - Preço promocional
 * @property {string} [ncm] - Nomenclatura Comum do Mercosul (código fiscal)
 * @property {string} [gtin] - Código GTIN/EAN
 * @property {string} [gtin_embalagem] - Código GTIN/EAN da embalagem
 * @property {string} [localizacao] - Localização física no estoque
 * @property {number} [peso_liquido] - Peso líquido em kg
 * @property {number} [peso_bruto] - Peso bruto em kg
 * @property {number} [estoque_minimo] - Estoque mínimo desejado
 * @property {number} [estoque_maximo] - Estoque máximo desejado
 * @property {number} [estoque_atual] - Estoque atual
 * @property {number} [id_fornecedor] - ID do fornecedor principal
 * @property {string} [codigo_fornecedor] - Código do produto no cadastro do fornecedor
 * @property {string} [codigo_pelo_fornecedor] - Código que o fornecedor usa
 * @property {string} [unidade_por_caixa] - Unidade de medida por caixa
 * @property {number} [preco_custo] - Preço de custo
 * @property {string} [classe_ipi] - Classe de IPI
 * @property {number} [valor_ipi_fixo] - Valor fixo de IPI
 * @property {string} [cod_lista_servicos] - Código da lista de serviços
 * @property {string} [descricao_complementar] - Descrição complementar
 * @property {string} [obs] - Observações
 * @property {string} [garantia] - Informações sobre garantia
 * @property {string} [cest] - Código Especificador da Substituição Tributária
 * @property {string} [codigo_anvisa] - Código ANVISA (obrigatório para medicamentos)
 * @property {number} [valor_max] - Valor máximo
 * @property {string} [motivo_isencao] - Motivo de isenção fiscal
 * @property {number} [dias_preparacao] - Dias necessários para preparação/produção
 * @property {string} [marca] - Marca do produto
 * @property {1 | 2 | 3} [tipo_embalagem] - Tipo de embalagem: 1 (Caixa/Pacote), 2 (Rolo/Cilindro), 3 (Envelope)
 * @property {number} [altura_embalagem] - Altura da embalagem em cm
 * @property {number} [largura_embalagem] - Largura da embalagem em cm
 * @property {number} [comprimento_embalagem] - Comprimento da embalagem em cm
 * @property {number} [diametro_embalagem] - Diâmetro da embalagem em cm (para embalagens cilíndricas)
 * @property {string} [categoria] - Categoria do produto
 * @property {"S" | "K" | "V" | "F" | "M"} [classe_produto] - Classe: "S" (Simples), "K" (Kit), "V" (Variável), "F" (Fabricado), "M" (Matéria-prima)
 *
 * @property {ProductStructureItemInput[]} [estrutura] - Itens da estrutura (para produtos fabricados)
 * @property {ProductProductionStageInput[]} [etapas] - Etapas de produção (para produtos fabricados)
 * @property {string[]} [anexos] - URLs de anexos/documentos
 * @property {ProductImageExternal[]} [imagens_externas] - Imagens externas do produto
 * @property {ProductKitItem[]} [kit] - Itens componentes (quando classe_produto="K")
 * @property {ProductVariationInput[]} [variacoes] - Variações do produto
 * @property {number[]} [tags] - Array de IDs de tags/categorias
 * @property {ProductSeoInput} [seo] - Dados de SEO para e-commerce
 * @property {ProductMappingInput[]} [mapeamentos] - Mapeamentos com plataformas de e-commerce
 */
export interface ProductCreateInput {
  // Campos Obrigatórios
  nome: string;
  unidade: string;
  preco: number;
  origem: string;
  situacao: "A" | "I";
  tipo: "P" | "S";

  // Campos Opcionais
  codigo?: string;
  preco_promocional?: number;
  ncm?: string;
  gtin?: string;
  gtin_embalagem?: string;
  localizacao?: string;
  peso_liquido?: number;
  peso_bruto?: number;
  estoque_minimo?: number;
  estoque_maximo?: number;
  estoque_atual?: number;
  id_fornecedor?: number;
  codigo_fornecedor?: string;
  codigo_pelo_fornecedor?: string;
  unidade_por_caixa?: string;
  preco_custo?: number;
  classe_ipi?: string;
  valor_ipi_fixo?: number;
  cod_lista_servicos?: string;
  descricao_complementar?: string;
  obs?: string;
  garantia?: string;
  cest?: string;
  codigo_anvisa?: string; // Obrigatório para medicamentos
  valor_max?: number;
  motivo_isencao?: string;
  dias_preparacao?: number;
  marca?: string;
  tipo_embalagem?: 1 | 2 | 3;
  altura_embalagem?: number;
  largura_embalagem?: number;
  comprimento_embalagem?: number;
  diametro_embalagem?: number;
  categoria?: string;
  classe_produto?: "S" | "K" | "V" | "F" | "M";

  /** Itens da estrutura (para produtos fabricados) */
  estrutura?: ProductStructureItemInput[];

  /** Etapas de produção (para produtos fabricados) */
  etapas?: ProductProductionStageInput[];

  /** URLs de anexos */
  anexos?: string[];

  /** Imagens externas (reutiliza o tipo de 'getById') */
  imagens_externas?: ProductImageExternal[];

  /** Itens do kit (reutiliza o tipo de 'getById') */
  kit?: ProductKitItem[];

  /** Variações do produto (usa o tipo de input 'ProductVariationInput') */
  variacoes?: ProductVariationInput[];

  /** Tags (array de IDs numéricos) */
  tags?: number[];

  /** Objeto de SEO */
  seo?: ProductSeoInput;

  /** Mapeamentos do produto principal */
  mapeamentos?: ProductMappingInput[];
}

/**
 * Representa a entrada de lote (batch) que o nosso método `create` espera.
 * O utilizador deve fornecer uma `sequencia` para cada produto.
 *
 * @interface ProductCreateEntry
 * @property {number} sequencia - Número de sequência único para identificar o produto no lote
 * @property {ProductCreateInput} data - Dados do produto a ser criado
 */
export interface ProductCreateEntry {
  sequencia: number;
  data: ProductCreateInput;
}

/**
 * Interface que representa um único erro no array `erros`.
 * (Baseado em retorno.registros[].registro.erros[].erro)
 *
 * @interface ProductErrorDetail
 * @property {string} erro - Mensagem de erro descritiva
 */
export interface ProductErrorDetail {
  erro: string;
}

/**
 * Representa o resultado de um único registo no lote (limpo).
 * (Baseado em retorno.registros[].registro)
 *
 * @interface ProductCreateResultRecord
 * @property {number} sequencia - Número de sequência do produto no lote
 * @property {"OK" | "Erro"} status - Status da operação: "OK" (sucesso) ou "Erro" (falha)
 * @property {number} [id] - ID do produto criado (presente apenas se status="OK")
 * @property {number} [codigo_erro] - Código do erro (presente apenas se status="Erro")
 * @property {ProductErrorDetail[]} [erros] - Lista de erros detalhados (presente apenas se status="Erro")
 * @property {{ variacao: { id: number } }[]} [variacoes] - IDs das variações criadas (retorno específico de variações)
 */
export interface ProductCreateResultRecord {
  sequencia: number;
  status: "OK" | "Erro";
  id?: number; // Presente se status="OK"
  codigo_erro?: number; // Presente se status="Erro"
  erros?: ProductErrorDetail[]; // Presente se status="Erro"
  variacoes?: { variacao: { id: number } }[]; // Retorno específico de variações
}

/**
 * O invólucro "sujo" que a API retorna.
 * Usado internamente pelo SDK para deserialização.
 *
 * @internal
 */
interface ApiProductCreateRecordWrapper {
  registro: ProductCreateResultRecord;
}

/**
 * Representa a resposta de SUCESSO completa do /produto.incluir.php
 * (baseado em `retorno`)
 *
 * @interface ProductCreateSuccessResponse
 * @property {number} status_processamento - Código de status do processamento
 * @property {"OK"} status - Status da operação (sempre "OK" em caso de sucesso)
 * @property {ApiProductCreateRecordWrapper[]} registros - Array de registros encapsulados com resultados da criação
 */
export interface ProductCreateSuccessResponse {
  status_processamento: number;
  status: "OK";
  registros: ApiProductCreateRecordWrapper[];
}
