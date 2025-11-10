import { describe, it, expect, vi, afterEach } from "vitest";
import { TinySDK } from "../index.js";
import { TinyApiError } from "../errors/tiny-api-error.js";
import type {
  Product,
  ProductDetails,
  ProductSearchSuccessResponse,
  ProductCreateEntry,
  ProductCreateResultRecord,
  ProductCreateSuccessResponse,
  ApiProductGetSuccessResponse,
} from "../types/products.js";

const MOCK_TOKEN = "test_token_123";

const mockErrorResponse = {
  retorno: {
    status_processamento: 2,
    status: "Erro",
    codigo_erro: 32,
    erros: [{ erro: "Token inválido ou expirado" }],
  },
};

// Mock de um produto resumido (usado em search)
const mockProduct: Product = {
  id: 12345,
  nome: "Notebook Dell Inspiron 15",
  preco: 3500.0,
  preco_promocional: 3200.0,
  tipoVariacao: "N",
  codigo: "DELL-INS15",
  preco_custo: 2800.0,
  preco_custo_medio: 2850.0,
  unidade: "UN",
  gtin: "7891234567890",
  localizacao: "A-01-01",
  situacao: "A",
  data_criacao: "01/01/2024 10:00:00",
};

// Mock da resposta "suja" da API de pesquisa (com wrappers)
const mockProductSearchResponse: ProductSearchSuccessResponse = {
  status_processamento: 3,
  status: "OK",
  pagina: 1,
  numero_paginas: 3,
  produtos: [
    {
      produto: mockProduct,
    },
    {
      produto: {
        ...mockProduct,
        id: 12346,
        nome: "Mouse Logitech MX Master",
        preco: 450.0,
      },
    },
  ],
};

// Mock de um produto detalhado (usado em getById)
const mockProductDetailsApi: ApiProductGetSuccessResponse = {
  status_processamento: 3,
  status: "OK",
  produto: {
    id: 12345,
    data_criacao: "01/01/2024 10:00:00",
    nome: "Camiseta Básica",
    codigo: "CAM-BASIC",
    unidade: "UN",
    preco: 49.9,
    preco_promocional: 39.9,
    ncm: "61091000",
    origem: "0",
    gtin: "7891234567890",
    gtin_embalagem: "",
    localizacao: "A-01-02",
    peso_liquido: 0.2,
    peso_bruto: 0.25,
    estoque_minimo: 10,
    estoque_maximo: 100,
    id_fornecedor: 999,
    codigo_fornecedor: "FORN-CAM-001",
    codigo_pelo_fornecedor: "CAM-BASIC-FORN",
    unidade_por_caixa: "UN",
    preco_custo: 25.0,
    preco_custo_medio: 26.5,
    situacao: "A",
    tipo: "P",
    classe_ipi: "",
    valor_ipi_fixo: 0,
    cod_lista_servicos: "",
    descricao_complementar: "Camiseta 100% algodão",
    obs: "Material de alta qualidade",
    garantia: "30 dias",
    cest: "1234567",
    tipoVariacao: "P",
    idProdutoPai: undefined,
    sob_encomenda: "N",
    dias_preparacao: 0,
    marca: "BasicWear",
    tipoEmbalagem: 1,
    alturaEmbalagem: 2,
    larguraEmbalagem: 15,
    comprimentoEmbalagem: 20,
    diametroEmbalagem: undefined,
    categoria: "Vestuário",
    classe_produto: "V",
    seo_title: "Camiseta Básica - BasicWear",
    seo_keywords: "camiseta, basica, algodao",
    link_video: "https://youtube.com/watch?v=example",
    seo_description: "Camiseta básica 100% algodão",
    slug: "camiseta-basica",
    grade: {},
    // Arrays "sujos" (com wrappers)
    anexos: [
      { anexo: "https://exemplo.com/anexo1.pdf" },
      { anexo: "https://exemplo.com/anexo2.pdf" },
    ],
    imagens_externas: [
      { imagem_externa: { url: "https://exemplo.com/img1.jpg" } },
      { imagem_externa: { url: "https://exemplo.com/img2.jpg" } },
    ],
    kit: [],
    mapeamentos: [
      {
        mapeamento: {
          idEcommerce: 1,
          skuMapeamento: "CAM-BASIC-SHOPIFY",
          idMapeamento: 100,
          preco: 49.9,
          preco_promocional: 39.9,
        },
      },
    ],
    variacoes: [
      {
        variacao: {
          id: 1001,
          codigo: "CAM-BASIC-AZUL-P",
          preco: 49.9,
          grade: { Cor: "Azul", Tamanho: "P" },
          mapeamentos: [
            {
              mapeamento: {
                idEcommerce: 1,
                skuMapeamento: "CAM-AZUL-P-SHOPIFY",
                skuMapeamentoPai: "CAM-BASIC-SHOPIFY",
                idMapeamentoPai: 100,
                idMapeamento: 101,
                preco: 49.9,
                preco_promocional: 39.9,
              },
            },
          ],
        },
      },
      {
        variacao: {
          id: 1002,
          codigo: "CAM-BASIC-AZUL-M",
          preco: 49.9,
          grade: { Cor: "Azul", Tamanho: "M" },
          mapeamentos: [],
        },
      },
    ],
  },
};

// Mock do resultado "limpo" esperado do getById
const mockProductDetailsClean: ProductDetails = {
  id: 12345,
  data_criacao: "01/01/2024 10:00:00",
  nome: "Camiseta Básica",
  codigo: "CAM-BASIC",
  unidade: "UN",
  preco: 49.9,
  preco_promocional: 39.9,
  ncm: "61091000",
  origem: "0",
  gtin: "7891234567890",
  gtin_embalagem: "",
  localizacao: "A-01-02",
  peso_liquido: 0.2,
  peso_bruto: 0.25,
  estoque_minimo: 10,
  estoque_maximo: 100,
  id_fornecedor: 999,
  codigo_fornecedor: "FORN-CAM-001",
  codigo_pelo_fornecedor: "CAM-BASIC-FORN",
  unidade_por_caixa: "UN",
  preco_custo: 25.0,
  preco_custo_medio: 26.5,
  situacao: "A",
  tipo: "P",
  classe_ipi: "",
  valor_ipi_fixo: 0,
  cod_lista_servicos: "",
  descricao_complementar: "Camiseta 100% algodão",
  obs: "Material de alta qualidade",
  garantia: "30 dias",
  cest: "1234567",
  tipoVariacao: "P",
  idProdutoPai: undefined,
  sob_encomenda: "N",
  dias_preparacao: 0,
  marca: "BasicWear",
  tipoEmbalagem: 1,
  alturaEmbalagem: 2,
  larguraEmbalagem: 15,
  comprimentoEmbalagem: 20,
  diametroEmbalagem: undefined,
  categoria: "Vestuário",
  classe_produto: "V",
  seo_title: "Camiseta Básica - BasicWear",
  seo_keywords: "camiseta, basica, algodao",
  link_video: "https://youtube.com/watch?v=example",
  seo_description: "Camiseta básica 100% algodão",
  slug: "camiseta-basica",
  grade: {},
  // Arrays "limpos" (sem wrappers)
  anexos: ["https://exemplo.com/anexo1.pdf", "https://exemplo.com/anexo2.pdf"],
  imagens_externas: [
    { url: "https://exemplo.com/img1.jpg" },
    { url: "https://exemplo.com/img2.jpg" },
  ],
  kit: [],
  mapeamentos: [
    {
      idEcommerce: 1,
      skuMapeamento: "CAM-BASIC-SHOPIFY",
      idMapeamento: 100,
      preco: 49.9,
      preco_promocional: 39.9,
    },
  ],
  variacoes: [
    {
      id: 1001,
      codigo: "CAM-BASIC-AZUL-P",
      preco: 49.9,
      grade: { Cor: "Azul", Tamanho: "P" },
      mapeamentos: [
        {
          idEcommerce: 1,
          skuMapeamento: "CAM-AZUL-P-SHOPIFY",
          skuMapeamentoPai: "CAM-BASIC-SHOPIFY",
          idMapeamentoPai: 100,
          idMapeamento: 101,
          preco: 49.9,
          preco_promocional: 39.9,
        },
      ],
    },
    {
      id: 1002,
      codigo: "CAM-BASIC-AZUL-M",
      preco: 49.9,
      grade: { Cor: "Azul", Tamanho: "M" },
      mapeamentos: [],
    },
  ],
};

// Mock de entrada para create() - produto simples
const mockCreateInput: ProductCreateEntry[] = [
  {
    sequencia: 1,
    data: {
      nome: "Produto Teste Create",
      unidade: "UN",
      preco: 100.0,
      origem: "0",
      situacao: "A",
      tipo: "P",
      codigo: "PROD-TEST-001",
      gtin: "7899999999999",
      anexos: ["https://exemplo.com/anexo.pdf"],
      imagens_externas: [{ url: "https://exemplo.com/imagem.jpg" }],
    },
  },
];

// Mock do payload "sujo" enviado à API (com wrappers)
const mockCreateApiPayloadDirty = {
  produtos: [
    {
      produto: {
        nome: "Produto Teste Create",
        unidade: "UN",
        preco: 100.0,
        origem: "0",
        situacao: "A",
        tipo: "P",
        codigo: "PROD-TEST-001",
        gtin: "7899999999999",
        sequencia: 1,
        anexos: [{ anexo: "https://exemplo.com/anexo.pdf" }],
        imagens_externas: [
          { imagem_externa: { url: "https://exemplo.com/imagem.jpg" } },
        ],
        kit: [],
        estrutura: [],
        etapas: [],
        variacoes: [],
        mapeamentos: [],
      },
    },
  ],
};

// Mock da resposta "suja" da API de create
const mockCreateApiResponseDirty: ProductCreateSuccessResponse = {
  status_processamento: 3,
  status: "OK",
  registros: [
    {
      registro: {
        sequencia: 1,
        status: "OK",
        id: 99999,
      },
    },
  ],
};

// Mock do resultado "limpo" esperado do create
const mockCreateResultClean: ProductCreateResultRecord[] = [
  {
    sequencia: 1,
    status: "OK",
    id: 99999,
  },
];

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Products Resource (sdk.products)", () => {
  describe("search()", () => {
    it('deve pesquisar e retornar produtos "desencapsulados" (unwrapped)', async () => {
      const fetchMock = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ retorno: mockProductSearchResponse }), {
          status: 200,
        })
      );
      vi.stubGlobal("fetch", fetchMock);

      const sdk = new TinySDK(MOCK_TOKEN);

      const result = await sdk.product.search("notebook", {
        pagina: 1,
        situacao: "A",
      });

      const expectedUrl = `https://api.tiny.com.br/api2/produtos.pesquisa.php?token=${MOCK_TOKEN}&formato=json&pesquisa=notebook&pagina=1&situacao=A`;
      expect(fetchMock).toHaveBeenCalledWith(expectedUrl, expect.any(Object));

      expect(result.produtos).toHaveLength(2);
      expect(result.pagina).toBe(1);
      expect(result.numero_paginas).toBe(3);
      expect(result.produtos[0]).toEqual(mockProduct);
      expect(result.produtos[1].nome).toBe("Mouse Logitech MX Master");
    });

    it("deve pesquisar com filtros adicionais (gtin, idTag)", async () => {
      const fetchMock = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ retorno: mockProductSearchResponse }), {
          status: 200,
        })
      );
      vi.stubGlobal("fetch", fetchMock);

      const sdk = new TinySDK(MOCK_TOKEN);

      await sdk.product.search("", {
        gtin: "7891234567890",
        idTag: 10,
        idListaPreco: 5,
      });

      const expectedUrl = `https://api.tiny.com.br/api2/produtos.pesquisa.php?token=${MOCK_TOKEN}&formato=json&pesquisa=&gtin=7891234567890&idTag=10&idListaPreco=5`;
      expect(fetchMock).toHaveBeenCalledWith(expectedUrl, expect.any(Object));
    });

    it("deve lançar um TinyApiError se a pesquisa de produtos falhar", async () => {
      const fetchMock = vi
        .fn()
        .mockResolvedValue(
          new Response(JSON.stringify(mockErrorResponse), { status: 200 })
        );
      vi.stubGlobal("fetch", fetchMock);

      const sdk = new TinySDK(MOCK_TOKEN);
      const act = () => sdk.product.search("Query Falha");

      expect.assertions(3);
      try {
        await act();
      } catch (error) {
        expect(error).toBeInstanceOf(TinyApiError);
        const tinyError = error as TinyApiError;
        expect(tinyError.message).toBe("Token inválido ou expirado");
        expect(tinyError.codigo).toBe(32);
      }
    });
  });

  describe("getById()", () => {
    it('deve obter e "desencapsular" (unwrap) um produto detalhado', async () => {
      const fetchMock = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ retorno: mockProductDetailsApi }), {
          status: 200,
        })
      );
      vi.stubGlobal("fetch", fetchMock);

      const sdk = new TinySDK(MOCK_TOKEN);
      const testId = 12345;

      const result = await sdk.product.getById(testId);

      const expectedUrl = `https://api.tiny.com.br/api2/produto.obter.php?token=${MOCK_TOKEN}&formato=json&id=${testId}`;
      expect(fetchMock).toHaveBeenCalledWith(expectedUrl, expect.any(Object));

      // Validar campos básicos
      expect(result.id).toBe(mockProductDetailsClean.id);
      expect(result.nome).toBe(mockProductDetailsClean.nome);
      expect(result.codigo).toBe(mockProductDetailsClean.codigo);

      // Validar desencapsulamento de anexos
      expect(result.anexos).toEqual(mockProductDetailsClean.anexos);

      // Validar desencapsulamento de imagens externas
      expect(result.imagens_externas).toEqual(
        mockProductDetailsClean.imagens_externas
      );

      // Validar desencapsulamento de mapeamentos
      expect(result.mapeamentos).toEqual(mockProductDetailsClean.mapeamentos);

      // Validar desencapsulamento de variações (incluindo mapeamentos nested)
      expect(result.variacoes).toHaveLength(2);
      expect(result.variacoes[0]).toEqual(mockProductDetailsClean.variacoes[0]);
      expect(result.variacoes[0].mapeamentos).toHaveLength(1);
      expect(result.variacoes[0].mapeamentos[0].skuMapeamento).toBe(
        "CAM-AZUL-P-SHOPIFY"
      );
      expect(result.variacoes[1].mapeamentos).toHaveLength(0);
    });

    it("deve tratar corretamente produto sem variações/kit/mapeamentos", async () => {
      const simpleProductApi: ApiProductGetSuccessResponse = {
        status_processamento: 3,
        status: "OK",
        produto: {
          ...mockProductDetailsApi.produto,
          tipoVariacao: "N",
          anexos: [],
          imagens_externas: [],
          kit: [],
          mapeamentos: [],
          variacoes: [],
        },
      };

      const fetchMock = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ retorno: simpleProductApi }), {
          status: 200,
        })
      );
      vi.stubGlobal("fetch", fetchMock);

      const sdk = new TinySDK(MOCK_TOKEN);
      const result = await sdk.product.getById(12345);

      expect(result.anexos).toEqual([]);
      expect(result.imagens_externas).toEqual([]);
      expect(result.kit).toEqual([]);
      expect(result.mapeamentos).toEqual([]);
      expect(result.variacoes).toEqual([]);
    });

    it("deve lançar um TinyApiError se a obtenção falhar", async () => {
      const fetchMock = vi
        .fn()
        .mockResolvedValue(
          new Response(JSON.stringify(mockErrorResponse), { status: 200 })
        );
      vi.stubGlobal("fetch", fetchMock);

      const sdk = new TinySDK(MOCK_TOKEN);
      const act = () => sdk.product.getById(999);

      expect.assertions(3);
      try {
        await act();
      } catch (error) {
        expect(error).toBeInstanceOf(TinyApiError);
        expect((error as TinyApiError).message).toBe(
          "Token inválido ou expirado"
        );
        expect((error as TinyApiError).codigo).toBe(32);
      }
    });
  });

  describe("create()", () => {
    it('deve "encapsular" (wrap) a entrada e "desencapsular" (unwrap) a saída', async () => {
      const fetchMock = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ retorno: mockCreateApiResponseDirty }), {
          status: 200,
        })
      );
      vi.stubGlobal("fetch", fetchMock);

      const sdk = new TinySDK(MOCK_TOKEN);

      const result = await sdk.product.create(mockCreateInput);

      const expectedUrl = `https://api.tiny.com.br/api2/produto.incluir.php?token=${MOCK_TOKEN}&formato=json`;
      expect(fetchMock).toHaveBeenCalledWith(
        expectedUrl,
        expect.objectContaining({ method: "POST" })
      );

      // Validar payload enviado
      const fetchBody = fetchMock.mock.calls[0][1]?.body as URLSearchParams;
      const produtoPayloadString = fetchBody.get("produto");
      const produtoPayloadJson = JSON.parse(produtoPayloadString || "{}");

      expect(produtoPayloadJson).toEqual(mockCreateApiPayloadDirty);

      // Validar resultado desencapsulado
      expect(result).toEqual(mockCreateResultClean);
    });

    it("deve criar produto com variações corretamente", async () => {
      const inputWithVariations: ProductCreateEntry[] = [
        {
          sequencia: 1,
          data: {
            nome: "Camiseta Com Variações",
            unidade: "UN",
            preco: 49.9,
            origem: "0",
            situacao: "A",
            tipo: "P",
            classe_produto: "V",
            variacoes: [
              {
                codigo: "CAM-AZUL-P",
                preco: 49.9,
                grade: { Cor: "Azul", Tamanho: "P" },
                estoque_atual: 10,
                mapeamentos: [
                  {
                    skuMapeamento: "CAM-AZUL-P-SHOP",
                    skuMapeamentoPai: "CAM-PAI-SHOP",
                    idEcommerce: 1,
                  },
                ],
              },
            ],
          },
        },
      ];

      const responseWithVariations: ProductCreateSuccessResponse = {
        status_processamento: 3,
        status: "OK",
        registros: [
          {
            registro: {
              sequencia: 1,
              status: "OK",
              id: 88888,
              variacoes: [{ variacao: { id: 1001 } }],
            },
          },
        ],
      };

      const fetchMock = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ retorno: responseWithVariations }), {
          status: 200,
        })
      );
      vi.stubGlobal("fetch", fetchMock);

      const sdk = new TinySDK(MOCK_TOKEN);
      const result = await sdk.product.create(inputWithVariations);

      // Validar payload enviado tem variações encapsuladas
      const fetchBody = fetchMock.mock.calls[0][1]?.body as URLSearchParams;
      const produtoPayloadString = fetchBody.get("produto");
      const produtoPayloadJson = JSON.parse(produtoPayloadString || "{}");

      expect(produtoPayloadJson.produtos[0].produto.variacoes).toHaveLength(1);
      expect(
        produtoPayloadJson.produtos[0].produto.variacoes[0].variacao
      ).toBeDefined();
      expect(
        produtoPayloadJson.produtos[0].produto.variacoes[0].variacao.mapeamentos
      ).toHaveLength(1);
      expect(
        produtoPayloadJson.produtos[0].produto.variacoes[0].variacao
          .mapeamentos[0].mapeamento
      ).toBeDefined();

      // Validar resultado
      expect(result[0].status).toBe("OK");
      expect(result[0].id).toBe(88888);
      expect(result[0].variacoes).toBeDefined();
    });

    it("deve criar múltiplos produtos em lote", async () => {
      const batchInput: ProductCreateEntry[] = [
        {
          sequencia: 1,
          data: {
            nome: "Produto 1",
            unidade: "UN",
            preco: 100.0,
            origem: "0",
            situacao: "A",
            tipo: "P",
          },
        },
        {
          sequencia: 2,
          data: {
            nome: "Produto 2",
            unidade: "UN",
            preco: 200.0,
            origem: "0",
            situacao: "A",
            tipo: "P",
          },
        },
      ];

      const batchResponse: ProductCreateSuccessResponse = {
        status_processamento: 3,
        status: "OK",
        registros: [
          {
            registro: {
              sequencia: 1,
              status: "OK",
              id: 11111,
            },
          },
          {
            registro: {
              sequencia: 2,
              status: "OK",
              id: 22222,
            },
          },
        ],
      };

      const fetchMock = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ retorno: batchResponse }), {
          status: 200,
        })
      );
      vi.stubGlobal("fetch", fetchMock);

      const sdk = new TinySDK(MOCK_TOKEN);
      const result = await sdk.product.create(batchInput);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(11111);
      expect(result[1].id).toBe(22222);
    });

    it("deve lançar um TinyApiError se a criação falhar", async () => {
      const fetchMock = vi
        .fn()
        .mockResolvedValue(
          new Response(JSON.stringify(mockErrorResponse), { status: 200 })
        );
      vi.stubGlobal("fetch", fetchMock);

      const sdk = new TinySDK(MOCK_TOKEN);
      const act = () => sdk.product.create(mockCreateInput);

      expect.assertions(3);
      try {
        await act();
      } catch (error) {
        expect(error).toBeInstanceOf(TinyApiError);
        expect((error as TinyApiError).message).toBe(
          "Token inválido ou expirado"
        );
        expect((error as TinyApiError).codigo).toBe(32);
      }
    });
  });
});
