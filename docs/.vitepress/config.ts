import { defineConfig } from "vitepress";

export default defineConfig({
  ignoreDeadLinks: true,
  title: "SDK TinyERP",
  description: "SDK não oficial em TypeScript para a API v2 do TinyERP (Olist)",

  lang: "pt-BR",

  themeConfig: {
    logo: "/logo.svg",

    nav: [
      { text: "Início", link: "/" },
      { text: "Guia", link: "/getting-started/installation" },
      { text: "Resources", link: "/resources/account" },
      { text: "Guias", link: "/guides/error-handling" },
      { text: "API Reference", link: "/api/" },
    ],

    sidebar: {
      "/": [
        {
          text: "Introdução",
          items: [{ text: "O que é SDK TinyERP?", link: "/" }],
        },
        {
          text: "Começando",
          items: [
            { text: "Instalação", link: "/getting-started/installation" },
            { text: "Autenticação", link: "/getting-started/authentication" },
            { text: "Início Rápido", link: "/getting-started/quick-start" },
          ],
        },
        {
          text: "Resources",
          items: [
            { text: "Account", link: "/resources/account" },
            { text: "Contacts", link: "/resources/contacts" },
            { text: "Products", link: "/resources/products" },
          ],
        },
        {
          text: "Guias",
          items: [
            { text: "Tratamento de Erros", link: "/guides/error-handling" },
            { text: "Paginação", link: "/guides/pagination" },
            { text: "Operações em Lote", link: "/guides/batch-operations" },
          ],
        },
        {
          text: "API Reference",
          items: [{ text: "Documentação Completa", link: "/api/" }],
        },
      ],
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/seu-usuario/sdk-tinyerp" },
    ],

    footer: {
      message: "SDK não oficial para TinyERP/Olist",
      copyright: "Lançado sob a licença MIT",
    },

    search: {
      provider: "local",
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: "Buscar",
                buttonAriaLabel: "Buscar",
              },
              modal: {
                noResultsText: "Nenhum resultado encontrado",
                resetButtonTitle: "Limpar busca",
                footer: {
                  selectText: "para selecionar",
                  navigateText: "para navegar",
                  closeText: "para fechar",
                },
              },
            },
          },
        },
      },
    },

    editLink: {
      pattern:
        "https://github.com/seu-usuario/sdk-tinyerp/edit/main/docs/:path",
      text: "Editar esta página no GitHub",
    },

    lastUpdated: {
      text: "Atualizado em",
      formatOptions: {
        dateStyle: "short",
        timeStyle: "short",
      },
    },

    docFooter: {
      prev: "Página anterior",
      next: "Próxima página",
    },

    outline: {
      label: "Nesta página",
      level: [2, 3],
    },

    returnToTopLabel: "Voltar ao topo",
    sidebarMenuLabel: "Menu",
    darkModeSwitchLabel: "Tema",
    lightModeSwitchTitle: "Mudar para tema claro",
    darkModeSwitchTitle: "Mudar para tema escuro",
  },

  head: [
    ["link", { rel: "icon", type: "image/svg+xml", href: "/logo.svg" }],
    ["meta", { name: "theme-color", content: "#646cff" }],
    ["meta", { name: "og:type", content: "website" }],
    ["meta", { name: "og:locale", content: "pt_BR" }],
    ["meta", { name: "og:site_name", content: "SDK TinyERP" }],
    [
      "meta",
      {
        name: "og:title",
        content: "SDK TinyERP - SDK não oficial para API v2",
      },
    ],
    [
      "meta",
      {
        name: "og:description",
        content:
          "SDK não oficial em TypeScript para a API v2 do TinyERP (Olist). Totalmente tipado, zero dependências.",
      },
    ],
  ],

  markdown: {
    lineNumbers: true,
    theme: {
      light: "github-light",
      dark: "github-dark",
    },
  },
});
