# Fair Grade frontend

Next.js 16 (App Router), React 19, Tailwind 4 and shadcn/ui. It talks to the backend over REST from the browser. For what the product does, how to run everything and how to deploy, see the [root README](../README.md).

## Run it

```bash
cp .env.example .env.local   # NEXT_PUBLIC_API_URL=http://localhost:3001
npm ci
npm run dev                  # http://localhost:3000
```

`NEXT_PUBLIC_API_URL` is inlined at build time: set it before `npm run build`.

| Script | |
|---|---|
| `npm run dev` | dev server |
| `npm run build`, `npm run start` | production build and server |
| `npm run lint`, `npx tsc --noEmit` | ESLint, type-check |

## Layout

```
app/(design)/            the application: login, courses, exams, papers, users
  design.css             the colour variables (light and dark); no hardcoded hex colours elsewhere
components/shell/        AppShell, navigation, theme and accessibility controls, shared UI pieces
lib/api.ts               apiFetch: base URL, bearer token, JSON, errors, 401 sends you to /login
lib/auth.ts              login, logout, session, where each role lands
app/(legacy)/            the first version of the app: frozen, not linked from the new UI
```

## Conventions

- Build screens from `@/components/shell` (`AppShell`, `PageHeader`, `Card`, `Pill`, `Button`, ...) and take colours from the CSS variables in `app/(design)/design.css`, so light and dark both work.
- Load data with `apiFetch` from `@/lib/api`; on a 403 `ApiError`, render `<NoAccess />`. Access is enforced by the backend: the UI only reflects it.
- Every number on screen comes from the API, never from a constant.
- Read `node_modules/next/dist/docs/` before using a Next 16 API you are unsure about.
