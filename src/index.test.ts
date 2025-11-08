import { describe, it, expect, vi, afterEach } from "vitest";

import { TinySDK } from "./index.js";
import { TinyApiError } from "./errors/tiny-api-error.js";

import type { InfoSuccessResponse } from "./types/account.ts";

const MOCK_TOKEN = "test_token_123";

const mockSuccessResponse: InfoSuccessResponse = {
  status_processamento: 3,
  status: "OK",
  conta: {
    razao_social: "Empresa Teste LTDA",
    cnpj_cpf: "1234567890001",
    fantasia: "Empresa Teste",
    endereco: "Rua dos Testes",
    numero: "123",
    bairro: "Centro",
    complemento: "Sala 1",
    cidade: "Vitest City",
    estado: "TS",
    cep: "12345-000",
    fone: "5511999998888",
    email: "teste@teste.com",
    inscricao_estadual: "12345",
    regime_tributario: "Simples Nacional",
  },
};

const mockErrorResponse = {
  retorno: {
    status_processamento: 2,
    status: "Erro",
    codigo_erro: 32,
    erros: [
      {
        erro: "Token inválido ou expirado",
      },
    ],
  },
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe("TinySDK", () => {
  describe("Account Resource (sdk.account)", () => {
    it("deve retornar os dados da conta em caso de sucesso", async () => {
      // 1. ARRANGE (Arrumar): Configurar o Mock
      const fetchMock = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ retorno: mockSuccessResponse }), {
          status: 200,
        })
      );
      vi.stubGlobal("fetch", fetchMock);

      const sdk = new TinySDK(MOCK_TOKEN);

      const result = await sdk.account.getInfo();

      expect(result).toEqual(mockSuccessResponse.conta);

      const expectedUrl = `https://api.tiny.com.br/api2/info.php?token=${MOCK_TOKEN}&formato=json`;
      expect(fetchMock).toHaveBeenCalledWith(expectedUrl, expect.any(Object));
    });

    it("deve lançar um TinyApiError em caso de erro da API", async () => {
      const fetchMock = vi
        .fn()
        .mockResolvedValue(
          new Response(JSON.stringify(mockErrorResponse), { status: 200 })
        );
      vi.stubGlobal("fetch", fetchMock);

      const sdk = new TinySDK(MOCK_TOKEN);

      const act = () => sdk.account.getInfo();

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
});
