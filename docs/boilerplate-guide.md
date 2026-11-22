# Guia do Vite Boilerplate

Este documento explica a arquitetura, as ferramentas, as convenções, a infraestrutura e os pontos de extensão incluídos no boilerplate React + Vite.

## 1. Quando utilizar

Esta base foi projetada para aplicações SPA que consomem uma API externa, como dashboards, backoffices, portais autenticados e sistemas internos.

Ela não inclui renderização no servidor, SEO avançado, Backend for Frontend ou armazenamento seguro de segredos. Quando o frontend precisar executar código protegido no servidor, use um backend dedicado ou outro framework apropriado.

## 2. Stack

| Ferramenta          | Responsabilidade                                      |
| ------------------- | ----------------------------------------------------- |
| React 19            | Interface e composição de componentes                 |
| Vite                | Desenvolvimento, transformação e build estático       |
| React Router        | Rotas, navegação e estados de erro/404                |
| TanStack Query      | Cache, sincronização e ciclo de vida do estado remoto |
| TypeScript          | Tipagem estática estrita                              |
| Tailwind CSS 4      | Estilos e design tokens                               |
| Zod                 | Validação de ambiente e contratos externos            |
| Vitest              | Testes unitários e de integração                      |
| Testing Library     | Testes orientados ao comportamento do usuário         |
| MSW                 | Simulação de APIs em testes de features               |
| Playwright + axe    | Testes E2E e acessibilidade automatizada              |
| ESLint + Prettier   | Regras arquiteturais, qualidade e formatação          |
| Husky + lint-staged | Verificações rápidas antes do commit                  |
| Nginx               | Entrega estática e fallback das rotas da SPA          |

## 3. Organização

```text
src/
├── app/
│   ├── routes/
│   ├── app.tsx
│   ├── providers.tsx
│   └── router.tsx
├── features/
│   └── <feature>/
│       ├── __tests__/
│       ├── api/
│       ├── components/
│       ├── queries/
│       └── types/
├── shared/
│   ├── lib/
│   ├── styles/
│   └── testing/
└── main.tsx
```

A dependência sempre aponta de `app` para `features` e de `features` para `shared`. Features não importam outras features. Se duas features precisam do mesmo código realmente genérico, ele é promovido para `shared`.

## 4. Inicialização e comandos

Ao criar um projeto a partir do template:

```bash
pnpm install --frozen-lockfile
pnpm init:project --name "Painel Operacional"
pnpm dev
```

O inicializador altera o nome da aplicação e do pacote, copia `.env.example` para `.env.local`, remove a feature demonstrativa e cria um marcador que impede uma segunda execução.

Comandos principais:

```bash
pnpm dev
pnpm verify
pnpm test:coverage
pnpm build
pnpm test:e2e
```

O Vite usa a porta `5173` no desenvolvimento e `4173` no preview do build.

## 5. Rotas e providers

`src/app/router.tsx` compõe as rotas com `createBrowserRouter`. A base contém home, estado de erro e 404. Providers globais ficam em `src/app/providers.tsx`; atualmente ele monta `QueryClientProvider`, `RouterProvider` e as Devtools do TanStack Query somente em desenvolvimento.

Novas páginas de rota pertencem a `src/app/routes`. A rota pode compor uma ou mais features, mas a feature não conhece a rota que a utiliza.

Como a aplicação é uma SPA, o servidor estático deve retornar `index.html` para URLs que não correspondem a um arquivo. Essa regra já existe em `nginx.conf`.

## 6. Estado remoto com TanStack Query

`createQueryClient()` fornece os defaults:

- dados permanecem frescos por 60 segundos;
- queries com falha recebem uma nova tentativa;
- o foco da janela não dispara refetch automaticamente.

Cada feature pode exportar query options que recebem um `ApiClient`:

```ts
export function userQueryOptions(client: ApiClient, userId: string) {
  return queryOptions({
    queryKey: ["users", userId],
    queryFn: () => getUser(client, userId),
  });
}
```

A chave inclui todos os parâmetros que mudam a resposta. Estado remoto não deve ser copiado para outro store global.

## 7. Variáveis de ambiente

```env
VITE_APP_NAME=Vite Boilerplate
VITE_APP_URL=http://localhost:5173
VITE_API_URL=http://localhost:3001
```

O módulo `src/shared/lib/env/env.ts` acessa cada valor literalmente por `import.meta.env` e valida o conjunto com Zod. Todas as variáveis `VITE_*` são incorporadas no JavaScript do navegador durante o build.

Portanto:

- nunca coloque segredos em variáveis `VITE_*`;
- valores diferentes por ambiente exigem um novo build;
- credenciais privadas e operações privilegiadas pertencem ao backend;
- `.env.local` é ignorado pelo Git.

## 8. Cliente HTTP

A factory de transporte utiliza Fetch e oferece:

- base URL validada;
- paths exclusivamente relativos;
- timeout padrão de 10 segundos;
- combinação do timeout com `AbortSignal` externo;
- `credentials: "same-origin"` por padrão;
- `getAuthHeaders` e `onUnauthorized` opcionais;
- Fetch injetável para testes;
- respostas vazias e status 204;
- validação do corpo por schema Zod.

`ApiError` representa uma resposta HTTP não bem-sucedida. `ApiContractError` representa uma resposta bem-sucedida que não atende ao contrato esperado.

O núcleo não escolhe armazenamento de token, refresh, logout, redirect ou toast. Projetos que usam Bearer implementam o header por `getAuthHeaders`.

## 9. Gerador de features

```bash
pnpm gen:feature team-members
```

O comando exige kebab-case, recusa sobrescrita e cria schema/tipo, fetcher, query options, componente e testes. O fetcher e as query options recebem o cliente HTTP para continuar testáveis.

## 10. Testes

- Testes do transporte injetam Fetch e não dependem de MSW.
- Testes de feature usam MSW quando precisam simular HTTP.
- Testes de componente utilizam Testing Library e jest-dom.
- Testes de arquitetura executam ESLint contra fixtures válidas e inválidas.
- Cobertura do núcleo em `src/shared/lib` exige 90% de linhas, funções e statements e 85% de branches.
- Playwright testa o build, a rota inicial, o fallback 404, o arquivo de health e WCAG A/AA com axe.
- Automação de acessibilidade não substitui revisão manual.

## 11. Build e Docker

`pnpm build` executa typecheck e produz `dist`. O Docker usa Node apenas para construir e Nginx sem privilégios para servir os arquivos na porta interna `8080`.

```bash
docker build -t vite-boilerplate .
docker run --rm -p 3000:8080 vite-boilerplate
```

Assets com hash recebem cache imutável. `/health.json` não recebe cache e confirma somente que os arquivos do frontend estão disponíveis; não mede API, banco ou outras dependências.

## 12. CI e automações

O GitHub Actions roda só o básico, em pull requests e manualmente (para não gastar minutos de Actions): formatação, `pnpm verify` (TypeScript, lint, testes, OpenSpec e skills) e build. Playwright/axe (`pnpm test:e2e`), testes de timezone e o container Docker rodam localmente quando necessário.

Não há Dependabot neste template; atualize dependências manualmente com `pnpm outdated` e `pnpm update`. Husky e lint-staged mantêm o pre-commit limitado a ESLint e Prettier.

## 13. Decisões adiadas

Autenticação, autorização, telemetria, formulários, store de estado local, biblioteca de componentes, internacionalização, Sentry e Storybook continuam dependentes do produto. Registre decisões duráveis em `docs/adr` quando forem adotadas.

## 14. Configuração do repositório

Depois da conversão, renomeie o repositório remoto para `vite-boilerplate`. Em uma organização, habilite template repository, rulesets de `main`, CI obrigatório, CodeQL, dependency review e CODEOWNERS somente quando os owners válidos forem conhecidos.
