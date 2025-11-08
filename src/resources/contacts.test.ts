import { describe, it, expect, vi, afterEach } from "vitest";
import { TinySDK } from "../index.js";
import { TinyApiError } from "../errors/tiny-api-error.js";
import type {
  Contact,
  ContactDetails,
  ContactGetSuccessResponse,
  ContactSearchSuccessResponse,
  PessoaContato,
  ContactCreateEntry,
  ContactCreateResultRecord,
  ContactCreateSuccessResponse,
  ContactUpdateEntry,
} from "../types/contacts.ts";

const MOCK_TOKEN = "test_token_123";

const mockErrorResponse = {
  retorno: {
    status_processamento: 2,
    status: "Erro",
    codigo_erro: 32,
    erros: [{ erro: "Token inválido ou expirado" }],
  },
};

const mockContact: Contact = {
  id: 101,
  codigo: "C001",
  nome: "Cliente Teste Mock",
  fantasia: "Cliente Teste",
  tipo_pessoa: "J",
  cpf_cnpj: "12345678000199",
  endereco: "Rua dos Mocks",
  numero: "99",
  complemento: "",
  bairro: "Mockingbairro",
  cep: "99999-000",
  cidade: "Vitest City",
  uf: "TS",
  email: "mock@cliente.com",
  fone: "5511888887777",
  id_lista_preco: 0,
  id_vendedor: 5,
  nome_vendedor: "Vendedor Mock" as any,
  situacao: "Ativo",
  data_criacao: "01/01/2024 10:00:00",
};

const mockContactSuccessResponse: ContactSearchSuccessResponse = {
  status_processamento: 3,
  status: "OK",
  pagina: 2,
  numero_paginas: 5,
  contatos: [
    {
      contato: mockContact,
    },
    {
      contato: { ...mockContact, id: 102, nome: "Outro Cliente" },
    },
  ],
};

const mockPessoaContato: PessoaContato = {
  id_pessoa: 1,
  nome: "Pessoa Teste",
  telefone: "5511999998888",
  ramal: "123",
  email: "teste@teste.com",
  departamento: "Departamento Teste",
};

const mockGetByIdApiResponse: ContactGetSuccessResponse = {
  status_processamento: 3,
  status: "OK",
  contato: {
    id: 123,
    codigo: "C123",
    nome: "Contato Detalhado",
    tipos_contato: [{ tipo: "Cliente" }, { tipo: "Fornecedor" }],
    pessoas_contato: [
      { pessoa_contato: mockPessoaContato },
      {
        pessoa_contato: {
          ...mockPessoaContato,
          id_pessoa: 2,
          nome: "Outra Pessoa",
        },
      },
    ],
  } as any,
};

const mockGetByIdCleanResult: ContactDetails = {
  id: 123,
  codigo: "C123",
  nome: "Contato Detalhado",
  // ...
  tipos_contato: ["Cliente", "Fornecedor"],
  pessoas_contato: [
    mockPessoaContato,
    { ...mockPessoaContato, id_pessoa: 2, nome: "Outra Pessoa" },
  ],
} as any;

const mockCreateInput: ContactCreateEntry[] = [
  {
    sequencia: 1,
    data: {
      nome: "Cliente SDK Create",
      situacao: "A",
      tipos_contato: ["Cliente"],
      pessoas_contato: [{ nome: "Pessoa Create" }],
    } as any,
  },
];

const mockCreateApiPayloadDirty = {
  contatos: [
    {
      contato: {
        nome: "Cliente SDK Create",
        situacao: "A",
        sequencia: 1,
        tipos_contato: [{ tipo: "Cliente" }],
        pessoas_contato: [{ pessoa_contato: { nome: "Pessoa Create" } }],
      },
    },
  ],
};

const mockCreateApiResponseDirty: ContactCreateSuccessResponse = {
  status_processamento: 3,
  status: "OK",
  registros: [
    {
      registro: {
        sequencia: 1,
        status: "OK",
        id: 999,
      },
    },
  ],
};

const mockCreateResultClean: ContactCreateResultRecord[] = [
  {
    sequencia: 1,
    status: "OK",
    id: 999,
  },
];

const mockUpdateInput: ContactUpdateEntry[] = [
  {
    sequencia: 1,
    data: {
      id: 123,
      nome: "Cliente SDK Update",
      situacao: "A",
      tipos_contato: ["Cliente", "Fornecedor"],
    } as any,
  },
];

/** Mock do "PAYLOAD SUJO" (o que enviamos no JSON.stringify) */
const mockUpdateApiPayloadDirty = {
  contatos: [
    {
      contato: {
        id: 123,
        nome: "Cliente SDK Update",
        situacao: "A",
        sequencia: 1,
        tipos_contato: [{ tipo: "Cliente" }, { tipo: "Fornecedor" }],
        pessoas_contato: [],
      },
    },
  ],
};

/** Mock da "RESPOSTA SUJA" (o que a API retorna)
 * (Reutilizamos a estrutura do 'create')
 */
const mockUpdateApiResponseDirty: ContactCreateSuccessResponse = {
  status_processamento: 3,
  status: "OK",
  registros: [
    {
      registro: {
        sequencia: 1,
        status: "OK",
        id: 123,
      },
    },
  ],
};

/** Mock do "RESULTADO LIMPO" (o que o SDK retorna)
 * (Reutilizamos a estrutura do 'create')
 */
const mockUpdateResultClean: ContactCreateResultRecord[] = [
  {
    sequencia: 1,
    status: "OK",
    id: 123,
  },
];

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Contacts Resource (sdk.contacts)", () => {
  it('deve pesquisar e retornar contatos "desembrulhados" (unwrapped)', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ retorno: mockContactSuccessResponse }), {
        status: 200,
      })
    );
    vi.stubGlobal("fetch", fetchMock);

    const sdk = new TinySDK(MOCK_TOKEN);

    const result = await sdk.contact.search("Cliente Teste", {
      pagina: 2,
    });

    const expectedUrl = `https://api.tiny.com.br/api2/contatos.pesquisa.php?token=${MOCK_TOKEN}&formato=json&pesquisa=Cliente+Teste&pagina=2`;
    expect(fetchMock).toHaveBeenCalledWith(expectedUrl, expect.any(Object));

    expect(result.contatos).toHaveLength(2);
    expect(result.pagina).toBe(2);
    expect(result.numero_paginas).toBe(5);
    expect(result.contatos[0]).toEqual(mockContact);
  });

  it("deve lançar um TinyApiError se a pesquisa de contatos falhar", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify(mockErrorResponse), { status: 200 })
      );
    vi.stubGlobal("fetch", fetchMock);

    const sdk = new TinySDK(MOCK_TOKEN);
    const act = () => sdk.contact.search("Query Falha");

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
  it('deve obter e "desembrulhar" (unwrap) um contato detalhado', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ retorno: mockGetByIdApiResponse }), {
        status: 200,
      })
    );
    vi.stubGlobal("fetch", fetchMock);
    const sdk = new TinySDK(MOCK_TOKEN);
    const testId = 123;

    const result: any = await sdk.contact.getById(testId);

    const expectedUrl = `https://api.tiny.com.br/api2/contato.obter.php?token=${MOCK_TOKEN}&formato=json&id=${testId}`;
    expect(fetchMock).toHaveBeenCalledWith(expectedUrl, expect.any(Object));

    expect(result.tipos_contato).toEqual(mockGetByIdCleanResult.tipos_contato);
    expect(result.pessoas_contato).toEqual(
      mockGetByIdCleanResult.pessoas_contato
    );
    expect(result.nome).toBe(mockGetByIdCleanResult.nome);
  });

  it("deve lançar um TinyApiError se a obtenção falhar", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify(mockErrorResponse), { status: 200 })
      );
    vi.stubGlobal("fetch", fetchMock);
    const sdk = new TinySDK(MOCK_TOKEN);
    const act = () => sdk.contact.getById(999);

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
  it('deve "embrulhar" (wrap) a entrada e "desembrulhar" (unwrap) a saída', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ retorno: mockCreateApiResponseDirty }), {
        status: 200,
      })
    );
    vi.stubGlobal("fetch", fetchMock);
    const sdk = new TinySDK(MOCK_TOKEN);

    const result = await sdk.contact.create(mockCreateInput);

    const expectedUrl = `https://api.tiny.com.br/api2/contato.incluir.php?token=${MOCK_TOKEN}&formato=json`;
    expect(fetchMock).toHaveBeenCalledWith(
      expectedUrl,
      expect.objectContaining({ method: "POST" })
    );

    const fetchBody = fetchMock.mock.calls[0][1]?.body as URLSearchParams;
    const contatoPayloadString = fetchBody.get("contato");
    const contatoPayloadJson = JSON.parse(contatoPayloadString || "{}");

    expect(contatoPayloadJson).toEqual(mockCreateApiPayloadDirty);

    expect(result).toEqual(mockCreateResultClean);
  });

  it("deve lançar um TinyApiError se a inclusão falhar", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify(mockErrorResponse), { status: 200 })
      );
    vi.stubGlobal("fetch", fetchMock);
    const sdk = new TinySDK(MOCK_TOKEN);
    const act = () => sdk.contact.create(mockCreateInput);

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
describe("update()", () => {
  it('deve "embrulhar" (wrap) a entrada e "desembrulhar" (unwrap) a saída', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ retorno: mockUpdateApiResponseDirty }), {
        status: 200,
      })
    );
    vi.stubGlobal("fetch", fetchMock);
    const sdk = new TinySDK(MOCK_TOKEN);

    const result = await sdk.contact.update(mockUpdateInput);

    const expectedUrl = `https://api.tiny.com.br/api2/contato.alterar.php?token=${MOCK_TOKEN}&formato=json`;
    expect(fetchMock).toHaveBeenCalledWith(
      expectedUrl,
      expect.objectContaining({ method: "POST" })
    );

    const fetchBody = fetchMock.mock.calls[0][1]?.body as URLSearchParams;
    const contatoPayloadString = fetchBody.get("contato");
    const contatoPayloadJson = JSON.parse(contatoPayloadString || "{}");

    expect(contatoPayloadJson).toEqual(mockUpdateApiPayloadDirty);

    expect(result).toEqual(mockUpdateResultClean);
  });

  it("deve lançar um TinyApiError se a alteração falhar", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify(mockErrorResponse), { status: 200 })
      );
    vi.stubGlobal("fetch", fetchMock);
    const sdk = new TinySDK(MOCK_TOKEN);
    const act = () => sdk.contact.update(mockUpdateInput);

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
