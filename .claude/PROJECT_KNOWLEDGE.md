# Project Knowledge

## Decisions
<!-- Architectural or design decisions made during sessions -->
[2025-05-25] landingapp features must always go under `landingapp/features/<feature>/` — legacy features at `landingapp/<feature>/` are a known bug to fix later.
[2025-05-25] CSS and TSX must always be in separate files — no inline styles, no embedded CSS in component files.
[2025-05-25] Hardcoded colors, spacing, or values are not allowed — always use or create CSS variables in `src/styles/variables.css`.
[2025-05-25] Hardcoded text labels are not allowed — all strings must use `useTranslation()` and `t()` from i18next.
[2025-05-25] Redux slices are only for form-flow state (loading/error/success). Display-only features use Zustand or local state.
[2026-05-25] Solution Detail page is generic and dynamic — one page for all solutions via `/solutions/:code`. Content comes from the API; i18n keys are static UI labels only.
[2026-05-26] All landing pages share the same hero structure from `home_page.css`: `.hero > .hero-inner > .hero-content` with `.hero-badge`, `.hero-title`, `.hero-title-gradient`, `.hero-subtitle`, `.hero-actions`, `.hero-btn-primary`, `.hero-btn-secondary`. Never build a custom hero for a new landing page.
[2026-05-26] All landing pages use `page-shell` as outer wrapper and `page-main` (with `style={{ paddingTop: 'var(--nav-topbar-height)' }}`) as the main element — both defined in `home_page.css`.
[2026-06-02] `TenantControlPanelPage` is a self-contained shell layout (sidebar + topbar + `<Outlet />`) in the landingapp — same structural pattern as `TenantLayout` in the tenant app. CSS prefix: `tcp-`. Route: `/account/*` (wildcard keeps the shell alive while sub-routes are added incrementally).
[2026-06-02] Section stubs for `tenant-control-panel` live directly in `pages/` (no subfolder). Sub-routes are wired into `routes.tsx` one at a time as each section is built — not all at once upfront.
[2026-06-08] `TcpSidebar` uses a light gradient background (`--color-primary-100` → `--color-gray-50` → `--color-accent-50`); all sidebar color tokens are in `variables.css` under `/* Tenant Control Panel */`. Text, hover, active, border tokens all use CSS variables — no hardcoded values.
[2026-06-08] `TcpTopBar` uses the same frosted-glass background as the home Navbar (`--nav-surface-bg` + `backdrop-filter: blur(12px)`). Shared nav components `NavLangButton` and `NavUserButton` live in `landingapp/common/components/` and are imported by both `Navbar.tsx` and `TcpTopBar.tsx`. `TcpTopBar.tsx` imports `navbar.css` directly so `--nav-*` tokens are available in the TCP shell.

## Conventions
<!-- Naming rules, file patterns, coding styles specific to this project -->
[2025-05-25] Page file names: `<Feature>Page.tsx` (PascalCase + Page suffix). Component file names: `<Name>.tsx` (PascalCase). CSS file names: `<name>.css` (kebab-case).
[2025-05-25] Feature file names follow the pattern `<feature>.<role>.ts` — e.g. `login.slice.ts`, `login.state.ts`, `login.types.ts`, `login.api.ts`.
[2025-05-25] `store/` folder is used in `landingapp`; `stores/` folder is used in `tenant`. Never mix them.
[2025-05-25] Redux slice export for reset action: `reset<Feature>` — e.g. `resetLogin`, `resetRegister`.
[2025-05-25] Redux thunks receive `t()` as an argument in the ThunkArg interface so slices stay i18n-aware.
[2025-05-25] State pattern mirrors flutter_bloc: discriminated union with `status: 'initial' | 'loading' | 'success' | 'error'`.
[2025-05-25] Always use `@/` path alias for imports that cross feature/app boundaries. Never use `../../` across app boundaries.
[2025-05-25] i18n default and fallback language is Spanish (`es`). Keys must always be added to both `en/` and `es/` simultaneously.

## Data Field Conventions
<!-- API field naming rules that are not obvious from the name alone -->
[2026-05-25] `iconUrl` fields contain a **Heroicon-style key** (e.g. `"chart-bar"`), NOT a URL and NOT a CSS class. Always render via `<FontAwesomeIcon icon={getFeatureIcon(iconUrl)} />` using the `getFeatureIcon` helper from `utils/featureIconMap.ts`. Fields that hold actual image URLs are named `imageUrl`.

## Recurring Fixes
[2026-05-31] Solution tabs in `PricingSection` were hidden behind `sorted.length > 1` guard — always remove that guard for pages that require multi-solution tab UI (e.g. `PricingPage`).
<!-- Things that need to be fixed or checked at the start of relevant sessions -->
<!-- [YYYY-MM-DD] Issue description → fix applied -->

## Skills
<!-- Skills available in .claude/skills/ and what they do -->
[2025-05-25] `stitch-to-code` — Fetches a Google Stitch design by name, confirms it with the user, and replicates it into the correct app/feature folder with separated CSS, CSS variables, and i18n keys.
[2025-05-25] `new-feature` — Scaffolds a complete feature folder structure for landingapp or tenant, with boilerplate files for slice, state, types, service, hook, page, and schema. Registers Redux slice in store.ts if needed.
[2025-05-25] `mem` — Loads project context at session start, auto-saves decisions and conventions to PROJECT_KNOWLEDGE.md, and appends a compact summary to SESSION_LOG.md at session end.
[2025-05-25] `react-state-pattern` — Existing skill (pre-dates this session). Purpose: enforces the flutter_bloc-inspired Redux state pattern used across the project.

## Never Do
<!-- Hard rules — things that must never happen in this project -->
[2025-05-25] Never store access tokens in localStorage — in-memory only (see `src/shared/utils/token.ts`).
[2025-05-25] Never use relative imports that cross app boundaries — always use `@/`.
[2025-05-25] Never put CSS inside TSX files — always a separate `.css` file imported at the top.
[2025-05-25] Never hardcode hex, rgba, or named color values in CSS — always use CSS variables.
[2026-06-08] `src/styles/variables.css` is the single source of truth for ALL colors. "No hardcoded colors" means every color value in every CSS file must reference a variable from `variables.css`. If a new color is needed, add a new variable there first, then reference it. This applies to Stitch replications, new features, and any component work — no exceptions.
[2025-05-25] Never hardcode user-visible strings in TSX — always use `t()` from i18next.
[2025-05-25] Never create a new feature folder at `landingapp/<feature>/` — always `landingapp/features/<feature>/`.
[2025-05-25] Never replicate a Stitch design without user confirmation of the exact design name first.

## Notes
<!-- Anything that doesn't fit the above categories -->
[2025-05-25] Project is a multi-tenant SaaS. Two apps: `landingapp` (public, main domain) and `tenant` (authenticated, subdomain per tenant).
[2025-05-25] No test runner is configured in this project.
[2025-05-25] Skills are located in `.claude/skills/`. Each skill has a `SKILL.md` and optionally a `references/` folder.
