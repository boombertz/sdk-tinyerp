import type { TinyV2HttpClient } from "../http-client.js";
import {
  ApiProductGetSuccessResponse,
  PaginatedProductsResponse,
  Product,
  ProductCreateEntry,
  ProductCreateResultRecord,
  ProductCreateSuccessResponse,
  ProductDetails,
  ProductSearchSuccessResponse,
  ProductsSearchOptions,
} from "../types/products.js";

/**
 * Recurso para gerenciar operações relacionadas a produtos na API do TinyERP.
 *
 * Esta classe fornece métodos para pesquisar e obter detalhes de produtos
 * cadastrados no sistema TinyERP, incluindo suporte a paginação, filtros
 * avançados e acesso a informações detalhadas como variações, kits e mapeamentos.
 *
 * @example
 * ```typescript
 * const tinyClient = new TinyV2HttpClient({ token: 'seu-token' });
 * const products = new ProductsResource(tinyClient);
 *
 * // Pesquisar produtos
 * const results = await products.search('notebook', {
 *   situacao: 'A',
 *   pagina: 1
 * });
 *
 * // Obter detalhes de um produto específico
 * const product = await products.getById(12345);
 * ```
 */
export class ProductsResource {
  private readonly http: TinyV2HttpClient;

  /**
   * Cria uma instância do ProductsResource.
   *
   * @param httpClient Cliente HTTP configurado com o token da API
   * @internal
   */
  constructor(httpClient: TinyV2HttpClient) {
    this.http = httpClient;
  }

  /**
   * Pesquisa produtos no catálogo do TinyERP com suporte a filtros avançados.
   *
   * Este método permite buscar produtos por termo de pesquisa (nome, código, etc.)
   * e aplicar diversos filtros como situação, tags, lista de preços e GTIN/EAN.
   * Os resultados são retornados de forma paginada.
   *
   * @param pesquisa - Termo de busca para localizar produtos (busca por nome, código, etc.)
   * @param options - Opções adicionais de filtro e paginação
   * @param options.idTag - Número de identificação da tag no Tiny
   * @param options.idListaPreco - Número de identificação da lista de preço no Tiny
   * @param options.pagina - Número da página para paginação dos resultados
   * @param options.gtin - GTIN/EAN do produto para busca específica
   * @param options.situacao - Situação dos produtos: 'A' (Ativo), 'I' (Inativo), 'E' (Excluído)
   * @param options.dataCriacao - Data de criação do produto no formato dd/mm/aaaa hh:mm:ss
   *
   * @returns Promise com os produtos encontrados e informações de paginação
   *
   * @throws {TinyApiError} Lança erro se a requisição à API falhar
   *
   * @example
   * ```typescript
   * // Busca simples por termo
   * const result = await products.search('notebook');
   *
   * // Busca com filtros
   * const result = await products.search('mouse', {
   *   situacao: 'A',
   *   pagina: 2,
   *   idListaPreco: 123
   * });
   *
   * // Busca por GTIN/EAN
   * const result = await products.search('', {
   *   gtin: '7891234567890'
   * });
   *
   * console.log(`Encontrados ${result.produtos.length} produtos`);
   * console.log(`Página ${result.pagina} de ${result.numero_paginas}`);
   * ```
   */
  public async search(
    pesquisa: string,
    options: ProductsSearchOptions = {}
  ): Promise<PaginatedProductsResponse> {
    const params = {
      pesquisa,
      ...options,
    };

    const response = await this.http.get("/produtos.pesquisa.php", params);

    const typedResponse = response as ProductSearchSuccessResponse;

    const produtos: Product[] = typedResponse.produtos.map(
      (item) => item.produto
    );

    return {
      produtos: produtos,
      pagina: typedResponse.pagina,
      numero_paginas: typedResponse.numero_paginas,
    };
  }

  /**
   * Obtém os detalhes completos de um produto específico pelo seu ID.
   *
   * Este método retorna informações detalhadas do produto incluindo dados cadastrais,
   * preços, estoque, dimensões, variações, kits, mapeamentos de e-commerce, imagens
   * externas e todas as demais informações disponíveis no cadastro do produto.
   *
   * Os dados retornados são "limpos" (desencapsulados), ou seja, sem os wrappers
   * internos da API, facilitando o uso direto das informações.
   *
   * @param id - Identificador único do produto no TinyERP
   *
   * @returns Promise com os detalhes completos do produto
   *
   * @throws {TinyApiError} Lança erro se a requisição à API falhar ou se o produto não for encontrado
   *
   * @example
   * ```typescript
   * // Obter detalhes de um produto simples
   * const product = await products.getById(12345);
   *
   * console.log(product.nome);           // Nome do produto
   * console.log(product.preco);          // Preço
   * console.log(product.estoque_minimo); // Estoque mínimo
   * console.log(product.codigo);         // Código/SKU
   * console.log(product.gtin);           // GTIN/EAN
   * ```
   *
   * @example
   * ```typescript
   * // Acessar variações de um produto variável
   * const product = await products.getById(12345);
   *
   * if (product.variacoes.length > 0) {
   *   console.log("Variações disponíveis:");
   *   product.variacoes.forEach(v => {
   *     console.log(`Código: ${v.codigo}`);
   *     console.log(`Preço: ${v.preco}`);
   *     console.log(`Grade:`, v.grade); // Ex: { "Cor": "Azul", "Tamanho": "M" }
   *   });
   * }
   * ```
   *
   * @example
   * ```typescript
   * // Acessar itens de um kit
   * const product = await products.getById(12345);
   *
   * if (product.classe_produto === "K" && product.kit.length > 0) {
   *   console.log("Itens do kit:");
   *   product.kit.forEach(item => {
   *     console.log(`Produto ID ${item.id_produto}: ${item.quantidade} unidade(s)`);
   *   });
   * }
   * ```
   *
   * @example
   * ```typescript
   * // Acessar dados de SEO e e-commerce
   * const product = await products.getById(12345);
   *
   * console.log("SEO:");
   * console.log(product.seo_title);
   * console.log(product.seo_description);
   * console.log(product.slug);
   *
   * console.log("\nMapeamentos de e-commerce:");
   * product.mapeamentos.forEach(m => {
   *   console.log(`Plataforma ${m.idEcommerce}: ${m.skuMapeamento}`);
   * });
   * ```
   */
  public async getById(id: number): Promise<ProductDetails> {
    const response = await this.http.get("/produto.obter.php", { id });

    const typedResponse = response as ApiProductGetSuccessResponse;

    const produtoApi = typedResponse.produto;

    const cleanAnexos = produtoApi.anexos?.map((a) => a.anexo) ?? [];

    const cleanImagensExternas =
      produtoApi.imagens_externas?.map((i) => i.imagem_externa) ?? [];

    const cleanKit = produtoApi.kit?.map((k) => k.item) ?? [];

    const cleanMapeamentos =
      produtoApi.mapeamentos?.map((m) => m.mapeamento) ?? [];

    const cleanVariacoes =
      produtoApi.variacoes?.map((v) => {
        const cleanVarMapeamentos =
          v.variacao.mapeamentos?.map((m) => m.mapeamento) ?? [];

        return {
          ...v.variacao,
          mapeamentos: cleanVarMapeamentos,
        };
      }) ?? [];

    return {
      ...produtoApi,
      anexos: cleanAnexos,
      imagens_externas: cleanImagensExternas,
      kit: cleanKit,
      mapeamentos: cleanMapeamentos,
      variacoes: cleanVariacoes,
    } as ProductDetails;
  }

  /**
   * Cria um ou mais produtos no TinyERP em lote (batch).
   *
   * Este método permite criar múltiplos produtos de uma vez, incluindo produtos simples,
   * produtos com variações, kits, produtos fabricados e serviços. Cada produto deve ter
   * um número de sequência único para identificação no resultado.
   *
   * A API do TinyERP processa todos os produtos enviados e retorna o resultado individual
   * de cada um, indicando sucesso (com ID do produto criado) ou erro (com detalhes do problema).
   *
   * @param products - Array de produtos a serem criados, cada um com sequência e dados
   *
   * @returns Promise com array de resultados individuais para cada produto
   *          - Para produtos criados com sucesso: status="OK" e o ID do produto
   *          - Para produtos com erro: status="Erro", código de erro e lista de erros
   *
   * @throws {TinyApiError} Lança erro se a requisição à API falhar
   *
   * @example
   * ```typescript
   * // Criar um produto simples
   * const result = await products.create([
   *   {
   *     sequencia: 1,
   *     data: {
   *       nome: "Notebook Dell Inspiron 15",
   *       unidade: "UN",
   *       preco: 3500.00,
   *       origem: "0",
   *       situacao: "A",
   *       tipo: "P",
   *       codigo: "DELL-INS15",
   *       gtin: "7891234567890",
   *       ncm: "84713012"
   *     }
   *   }
   * ]);
   *
   * // Verificar resultado
   * result.forEach(r => {
   *   if (r.status === "OK") {
   *     console.log(`Produto ${r.sequencia} criado com ID: ${r.id}`);
   *   } else {
   *     console.error(`Erro na sequência ${r.sequencia}:`, r.erros);
   *   }
   * });
   * ```
   *
   * @example
   * ```typescript
   * // Criar produto com variações (ex: camiseta com cores e tamanhos)
   * const result = await products.create([
   *   {
   *     sequencia: 1,
   *     data: {
   *       nome: "Camiseta Básica",
   *       unidade: "UN",
   *       preco: 49.90,
   *       origem: "0",
   *       situacao: "A",
   *       tipo: "P",
   *       classe_produto: "V",
   *       variacoes: [
   *         {
   *           codigo: "CAM-AZUL-P",
   *           preco: 49.90,
   *           grade: { "Cor": "Azul", "Tamanho": "P" },
   *           estoque_atual: 10
   *         },
   *         {
   *           codigo: "CAM-AZUL-M",
   *           preco: 49.90,
   *           grade: { "Cor": "Azul", "Tamanho": "M" },
   *           estoque_atual: 15
   *         },
   *         {
   *           codigo: "CAM-VERM-P",
   *           preco: 49.90,
   *           grade: { "Cor": "Vermelho", "Tamanho": "P" },
   *           estoque_atual: 8
   *         }
   *       ]
   *     }
   *   }
   * ]);
   * ```
   *
   * @example
   * ```typescript
   * // Criar um kit de produtos
   * const result = await products.create([
   *   {
   *     sequencia: 1,
   *     data: {
   *       nome: "Kit Escritório Completo",
   *       unidade: "UN",
   *       preco: 150.00,
   *       origem: "0",
   *       situacao: "A",
   *       tipo: "P",
   *       classe_produto: "K",
   *       kit: [
   *         { id_produto: 12345, quantidade: 1 },  // Notebook
   *         { id_produto: 12346, quantidade: 1 },  // Mouse
   *         { id_produto: 12347, quantidade: 1 }   // Teclado
   *       ]
   *     }
   *   }
   * ]);
   * ```
   *
   * @example
   * ```typescript
   * // Criar múltiplos produtos em lote
   * const result = await products.create([
   *   {
   *     sequencia: 1,
   *     data: {
   *       nome: "Produto 1",
   *       unidade: "UN",
   *       preco: 100.00,
   *       origem: "0",
   *       situacao: "A",
   *       tipo: "P"
   *     }
   *   },
   *   {
   *     sequencia: 2,
   *     data: {
   *       nome: "Produto 2",
   *       unidade: "UN",
   *       preco: 200.00,
   *       origem: "0",
   *       situacao: "A",
   *       tipo: "P"
   *     }
   *   },
   *   {
   *     sequencia: 3,
   *     data: {
   *       nome: "Serviço de Consultoria",
   *       unidade: "HR",
   *       preco: 150.00,
   *       origem: "0",
   *       situacao: "A",
   *       tipo: "S"
   *     }
   *   }
   * ]);
   *
   * // Processar resultados
   * const sucessos = result.filter(r => r.status === "OK");
   * const erros = result.filter(r => r.status === "Erro");
   *
   * console.log(`${sucessos.length} produtos criados com sucesso`);
   * console.log(`${erros.length} produtos com erro`);
   * ```
   */
  public async create(
    products: ProductCreateEntry[]
  ): Promise<ProductCreateResultRecord[]> {
    const apiPayload = {
      produtos: products.map((entry) => {
        const { data, sequencia } = entry;

        const wrappedAnexos = data.anexos
          ? data.anexos.map((url) => ({ anexo: url }))
          : [];

        const wrappedImagens = data.imagens_externas
          ? data.imagens_externas.map((img) => ({ imagem_externa: img }))
          : [];

        const wrappedKit = data.kit
          ? data.kit.map((item) => ({ item: item }))
          : [];

        const wrappedEstrutura = data.estrutura
          ? data.estrutura.map((item) => ({ item: item }))
          : [];

        const wrappedEtapas = data.etapas
          ? data.etapas.map((etapa) => ({ etapa: etapa }))
          : [];

        const wrappedVariacoes = data.variacoes
          ? data.variacoes.map((variacao) => ({
              variacao: {
                ...variacao,
                mapeamentos: variacao.mapeamentos
                  ? variacao.mapeamentos.map((m) => ({ mapeamento: m }))
                  : [],
              },
            }))
          : [];

        const wrappedMapeamentos = data.mapeamentos
          ? data.mapeamentos.map((m) => ({ mapeamento: m }))
          : [];

        return {
          produto: {
            ...data,
            sequencia,
            anexos: wrappedAnexos,
            imagens_externas: wrappedImagens,
            kit: wrappedKit,
            estrutura: wrappedEstrutura,
            etapas: wrappedEtapas,
            variacoes: wrappedVariacoes,
            mapeamentos: wrappedMapeamentos,
          },
        };
      }),
    };

    const body = {
      produto: JSON.stringify(apiPayload),
    };

    const response = await this.http.post("/produto.incluir.php", body);

    const typedResponse = response as ProductCreateSuccessResponse;

    const cleanResults = typedResponse.registros.map((r) => r.registro);

    return cleanResults;
  }
}
