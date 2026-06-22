# Session Log
<!-- Newest session at the top -->

---
## [2026-06-16] — Email verification full-stack plan + Pre-Phase fixes applied
- Defined 5-phase plan: Phase 1 backend fixes, Phase 2 session foundation, Phase 3 verify-email feature, Phase 4 guards & routing, Phase 5 entry point (ProfileSection button).
- Applied Pre-Phase fixes: `register.types.ts` (renamed `tenantStatus` → `tenantStatusCode`, added `emailVerified` + `onboardingCompleted`), `register.slice.ts` (mapped all new fields in `setAuth`), `landing.api.ts` (removed stale `verifyEmail` method).
- All `setAuth` call sites now consistent: `login.slice.ts`, `register.slice.ts`, `useTenantAuth.ts`, `createApiClient.ts`.
- Session ended before Phase 3 — next step is building the verify-email feature (types → api → state → slice → hook → styles → page).
---

---
## [2026-06-12] — OnboardingChecklist fully rebuilt from raw Stitch HTML
- Rebuilt `OnboardingChecklist.tsx` from raw HTML (both states) — 3-column grid layout, featured profile card, pending-state action buttons, state-aware descriptions, status badge.
- Added 19 new `--oc-*` CSS variables to `variables.css`; `onboarding-checklist.css` fully rewritten.
- Updated both `en/` and `es/` `dashboard.json`: new keys `stepsRemaining`, `allCompleted`, `verifyAction`, `setupAction`, `choosePlanAction`, `statusNoPlan`, `descriptionDone` per step.
- Subscription pending badge is now error (red) to match design; profile card is always featured regardless of state.
---
## [2026-06-11] — stitch-to-code skill improved for design fidelity
- Diagnosed root cause of design/component mismatch: `WebFetch` summarizes Stitch HTML through a small AI model, losing visual detail (spacing, colors, element hierarchy).
- Compared "Onboarding Checklist Component" and "Onboarding Checklist - Completed State" Stitch screens against current `OnboardingChecklist.tsx` — found 4 gaps: missing progress counter, no pending-state action buttons, single static description per step, and single-card vs. per-card layout.
- Updated `stitch-to-code` SKILL.md: added dual input path (design name OR raw HTML paste), replaced `WebFetch` with `Invoke-WebRequest` + `Read` for lossless raw HTML access.
- OnboardingChecklist component gaps noted but NOT fixed this session — user chose to save and stop.
---
## [2026-06-08] — TcpSidebar & TcpTopBar restyled
- Sidebar background changed to light gradient (`--color-primary-100` → `--color-gray-50` → `--color-accent-50`); all colors moved to `variables.css` under `/* Tenant Control Panel */` section — no hardcoded values remain.
- Clarified and saved rule: `variables.css` is the single source of truth for ALL colors; "no hardcoded colors" applies to every CSS file project-wide.
- TcpTopBar now uses the same frosted-glass background as the home Navbar (`--nav-surface-bg` + `backdrop-filter`); has a "back to home" icon link before the title.
- `NavLangButton` and `NavUserButton` extracted from `Navbar.tsx` into `landingapp/common/components/` — shared by both `Navbar` and `TcpTopBar`.
- i18n updates: `title` → "Manage Account" / "Administrar cuenta"; `subtitle` → "Administrator Panel" / "Panel de Administrador"; `backToHome` added to both locales.
---
## [2026-06-02] — TenantControlPanel base shell built
- Built shell layout: `TenantControlPanelPage` now hosts `TcpSidebar` + `TcpTopBar` + `<Outlet />` (mirrors `TenantLayout` pattern).
- Created `TcpSidebar` (Material Symbols icons, NavLink active state, logout via `clearAuth()`) and `TcpTopBar` (page title + user initials avatar).
- Created 6 section stubs in `pages/` (Dashboard, Subscriptions, Invoices, Payments, Profile, Settings) — content to be filled per step.
- Route changed from `AccountPage` → `TenantControlPanelPage` at `/account/*`; sub-routes added incrementally as sections are built.
- Added full `nav`, `topBar`, `sections` i18n key groups to both `en/` and `es/` landing.json; CSS token prefix `--tcp-*` in `tenant-control-panel.css`.
---
## [2026-06-01] — Navbar radical changes: logo + nav links routing
- Logo ("DS DreamSoft") changed from `<a href="#hero">` scroll anchor to `<Link to="/home">` — works correctly from any page.
- Nav links (Solutions, Features, Pricing) changed from scroll-to-section behavior to dedicated routes (`/solutions`, `/features`, `/pricing`).
- Replaced `<Link>` with `<NavLink>` in both desktop and mobile renders — active tab underline now driven by current route via `isActive` callback.
- Removed all dead code: intersection observer, `handleScrollLink`, `activeSection` state, and `href` fields from navLinks.
---
## [2026-05-31] — Stitch design: Pricing Plans - Multi-Solution Support replicated
- Replicated Stitch screen "Pricing Plans - Multi-Solution Support"; moved `PricingPage.tsx` to correct location `features/home/pages/`; deleted legacy `pages/PricingPage.tsx`.
- Created `PricingComparisonSection.tsx`, `PricingFaqSection.tsx`, `pricing-page.css`; added `pricingComparison` + `pricingFaq` i18n blocks to both locales.
- Fixed: solution tabs hidden behind `sorted.length > 1` guard — removed from both `PricingSection` and `PricingComparisonSection`.
- Implemented Pattern B (Zustand): created `pricing.store.ts`; rewrote `usePricing.ts` as a thin bridge — single shared store eliminates duplicate API calls.
- Deleted `pages/PricingPage.tsx` after confirming nothing imported from it.
---
## [2026-05-26] — FeaturesCatalogPage made dynamic + navbar Features link wired
- Replaced static modules with API-driven rendering from `GET /api/v1/landing/Features/GetAllFeatures`; added types, Zustand store, hook, and API method.
- Added loading skeleton, error/retry state, `.fc-modules-section` background wrapper; switched all dynamic icons to `FontAwesomeIcon + getFeatureIcon()`.
- Navbar "Features" link changed from `#features` scroll to `<Link to="/features">` on desktop and mobile via optional `to` field on navLinks.
---
## [2026-05-26] — Stitch design: Features Catalog replicated + hero aligned
- Replicated Stitch screen "Features Catalog - Consistent Design" into `landingapp/features/home/pages/FeaturesCatalogPage.tsx` with 3 modules: Inventory, Sales (featured POS card), Purchases.
- Created `features-catalog.css` (prefix `fc-`); added 23 `--fc-*` CSS variables to `variables.css`; added `featuresCatalog` i18n block to both `en/` and `es/` landing.json.
- Wired `/features` route to `FeaturesCatalogPage`, replacing the `FeaturesPage` placeholder.
- Hero section refactored to use shared `home_page.css` classes (`.hero`, `.hero-badge`, `.hero-title-gradient`, etc.) — same pattern as `SolutionPage` and `SolutionDetailPage`.
- Established rule: all landing pages must use `page-shell`/`page-main` shell and the shared hero structure.
---
## [2026-05-25] — SolutionDetailPage plan cards refined to match PricingCard design
- Fixed `iconUrl` field: it holds a Heroicon-style key (e.g. `"chart-bar"`), not a URL or CSS class — must render via `<FontAwesomeIcon icon={getFeatureIcon(iconUrl)} />`.
- Plan cards fully redesigned to match `PricingCard`: `bg-white shadow-sm`, solid primary-500 active state, star+secondary badge, `text-5xl` price, divider, solid CTA with inverted active state.
- Added `plan.description` below plan name; introduced `formatLimitValue()` helper matching PricingCard pattern.
- Feature detail columns regrouped by `moduleCode`/`moduleName` instead of `groupCode`/`groupName`.
- Module header icon placeholder removed; replaced with `border-l-4` accent + bold uppercase title; option rows now show `getFeatureIcon(option.iconUrl)` icon.
---
## [2026-05-25] — SolutionDetailPage corrected to match Stitch "Solution Details - Interactive Plan Features"
- Previous session had replicated the wrong Stitch design ("POS & Pricing"); this session corrected it to screen `6bf8b4e0dc184419911c1a9cc927fbc1` in project `13969555437449551134`.
- Replaced flat options grid + tabs pattern with: interactive plan cards (click to select), 3-column feature detail card (check/lock per selected plan), segmented billing toggle (MONTHLY/QUARTERLY/ANNUAL).
- Social proof (JD/AS/+5 avatars) and "Comenzar con [Plan]" CTA now live inside the feature detail card, not as separate sections.
- Dark CTA section (`sd-dark-cta-*`) replaces the old light card CTA at the bottom of the page.
- Memory system initialized: `MEMORY.md` now points to `PROJECT_KNOWLEDGE.md` and `SESSION_LOG.md` in `.claude/`.
---
## [2026-05-25] — Solution Detail page redesigned as dynamic API-driven page
- Deleted static `SolutionDetailsPosPage.tsx`; replaced with generic `SolutionDetailPage.tsx` at `src/apps/landingapp/features/home/pages/`.
- New page fetches `GET /api/v1/landing/Solutions-Features/{code}`; renders hero, options grid (grouped by `groupCode`), pricing cards with billing cycle toggle, and CTA — all from API data.
- Route changed from `/solutions/pos` → `/solutions/:code`; "Learn More" links in `SolutionsSection` and `CoreOfferingsSection` now navigate to `/solutions/${solution.code}`.
- Replaced `solutionDetailsPOS` i18n block with `solutionDetail` (static labels only; content comes from API).
- Fixed `.vscode/launch.json`: `webRoot` → `${workspaceFolder}/src`, `/@fs/*` override → `/*`.
---
## [2026-05-25] — Stitch design: Solution Details POS & Pricing
- Replicated Stitch screen "Solution Details - POS & Pricing" (project `13969555437449551134`, screen `28ac199cba5e4928991bd1dc169ef955`) into `landingapp`.
- Created `SolutionDetailsPosPage.tsx` at `src/apps/landingapp/features/home/pages/`.
- Created `solution-details-pos.css` (CSS prefix `sdp-`); reuses existing classes from `home_page.css`.
- Added i18n key block `solutionDetailsPOS` to both `en/landing.json` and `es/landing.json`.
- Registered public route `/solutions/pos` in `src/apps/landingapp/routes.tsx`.
---
## [2025-05-25] — Memory system and skills setup
- Built `stitch-to-code` skill: fetches and replicates Google Stitch designs with design name confirmation, CSS/TSX separation, CSS variables, and i18n keys.
- Built `new-feature` skill: scaffolds complete feature folder structure with boilerplate files for both `landingapp` and `tenant` apps.
- Built `mem` skill: persistent memory system with `PROJECT_KNOWLEDGE.md` (conventions and decisions) and `SESSION_LOG.md` (session history).
- Confirmed `landingapp` feature folder bug — new features must go under `landingapp/features/<feature>/`, not `landingapp/<feature>/`.
- Pre-populated `PROJECT_KNOWLEDGE.md` with all conventions and rules discovered during this session.
---
