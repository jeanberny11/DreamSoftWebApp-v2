# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Vite HMR)
npm run build     # Type-check (tsc -b) then bundle
npm run lint      # ESLint across all files
npm run preview   # Preview production build locally
```

No test runner is configured.

## Architecture Overview

DreamSoftWebApp is a **multi-tenant SaaS platform** split into two distinct React apps that share infrastructure but serve different audiences.

### Subdomain-Based App Routing

[src/AppRouter.tsx](src/AppRouter.tsx) detects the subdomain at runtime and renders one of two apps:

- **LandingApp** (`src/apps/landingapp/`) — served on the main domain; handles the public marketing site, tenant owner registration/login, and the tenant owner dashboard.
- **TenantApp** (`src/apps/tenant/`) — served on `*.dreamsoft.com` subdomains; handles per-tenant dashboards with role-based dynamic menus.

Each app has its own `routes.tsx` and auth guards. Adding a new top-level section means choosing which app it belongs to and wiring it into that app's routes.

### Authentication & Token Security

Access tokens are stored **in memory only** (never in `localStorage`) — see [src/shared/utils/token.ts](src/shared/utils/token.ts). Refresh tokens are in httpOnly cookies (managed by the backend). There are three isolated token contexts (`tenant`, `erp`, `admin`) to support concurrent sessions.

The API client factory ([src/shared/api/createApiClient.ts](src/shared/api/createApiClient.ts)) attaches the Bearer token and `Accept-Language` header on every request. A 401 response triggers a token refresh with a request queue to prevent duplicate refresh calls. On refresh failure the token is cleared and the user is redirected to login.

### State Management (Zustand)

Four stores in [src/shared/store/](src/shared/store/):

| Store | Responsibility |
|---|---|
| `ui.store.ts` | Sidebar state, light/dark theme, global loading flag |
| `menu.store.ts` | Role-based dynamic menu fetched from API |
| `language.store.ts` | Current language + available languages from API |
| `tenant_auth.store.ts` | Tenant session data (tenantId, email, tenantStatus) |

`ui.store` is persisted to `localStorage` under the key `dreamsoft-ui-storage`. All other stores are session-only.

### API Layer

All HTTP calls go through Axios instances created via `createApiClient()`. Feature-specific clients live in [src/shared/api/](src/shared/api/) and [src/apps/landingapp/common/api/](src/apps/landingapp/common/api/). All responses are wrapped in an `ApiResult<T>` discriminated union (see [src/shared/types/api.types.ts](src/shared/types/api.types.ts)) — always check `.success` before accessing `.data`.

### Theming & Styles

Light/dark mode is toggled by setting a `data-theme` attribute on `document.documentElement`. CSS variables define all palette values; Tailwind classes reference those variables. Theme files are in [src/shared/styles/themes/](src/shared/styles/themes/). The Tailwind color palette uses semantic names: `primary` (teal), `secondary` (emerald), `accent` (cyan).

### Internationalization

i18next is initialized in [src/shared/i18n/config.ts](src/shared/i18n/config.ts) with static EN/ES locale files. Default and fallback language is Spanish (`es`). Namespaces: `common`, `auth`, `validation`, `landing`, `dashboard`. Language availability is also fetched from the API via `language.store`.

### Path Alias

`@/` maps to `src/` (configured in both [vite.config.ts](vite.config.ts) and [tsconfig.app.json](tsconfig.app.json)). Always use `@/` for imports rather than relative paths that cross app boundaries.
