# DreamSoft WebApp — Frontend Design Context

> This file is intended for AI-assisted design tools (e.g. Google Stitch) to understand
> the full frontend context of DreamSoft WebApp before generating any UI screens.
> It covers the product purpose, app structure, color system, typography, layout, components, and feature scope.

---

## 1. Product Overview

**DreamSoft WebApp** is a multi-tenant SaaS web application.
Each tenant (business/company) gets their own subdomain and accesses a role-based dashboard
to manage their business operations — starting with **Invoices** and **Customers**.

**Target Users:** Business owners, managers, and employees of small-to-medium businesses.

**Core Use Cases (Phase 1):**
- Manage customers (create, view, edit)
- Manage invoices (create, send, track status)
- Role-based access to features via dynamic menu

---

## 2. Application Architecture (Frontend)

The app is split into two sub-applications:

### 2a. Landing App (`/`)
Public-facing marketing site + authentication flows.
- Home page (hero, features, pricing, testimonials, CTA)
- Login page
- Register page
- Onboarding page
- Pricing page / Features page

### 2b. Tenant App (`/{tenant-subdomain}/*`)
Authenticated dashboard shell for business users.
- Accessed via unique subdomain per tenant
- All routes are protected (AuthGuard + PermissionGuard)
- Menu items are fetched dynamically from the API based on user role
- Built around a persistent **Sidebar + TopBar** shell layout

**Tenant App Routes (current):**
- `/dashboard` — Main dashboard (to be designed)
- `/customers` — Customer management (planned)
- `/invoices` — Invoice management (planned)

---

## 3. Shell Layout (Tenant App)

The tenant app uses a fixed layout shell with three parts:

### Sidebar (Left, Vertical)
- **Width:** 64px (collapsed) / 256px (expanded)
- **Background:** `#111827` (gray-900)
- **Text:** `#d1d5db` (gray-300), white on hover/active
- **Active item:** `#0d9488` (primary-600) background, white text
- **Logo area:** top of sidebar, height 64px, bottom border `gray-700`
  - Expanded: shows "DreamSoft" in bold
  - Collapsed: shows "DS" abbreviation
- **Navigation:** vertical list of menu items with icon + label
  - Icons: FontAwesome or PrimeIcons
  - Collapsed: icon only; Expanded: icon + label
- **Toggle:** controlled by a button in the TopBar (hamburger icon `☰`)
- **Behavior:** smooth CSS transition (`duration-300`)

### TopBar (Top, Horizontal)
- **Height:** 64px
- **Background:** `#ffffff` (white in light theme), `#111827` (dark theme)
- **Border-bottom:** `#e5e7eb` (gray-200)
- **Left side:** sidebar toggle button + breadcrumb navigation
- **Right side:** user full name (text) + user avatar (circle with first letter initial)
  - Avatar: currently uses `bg-blue-600` — should be updated to `bg-primary-600` (#0d9488)
- **Padding:** horizontal `px-6`

### Main Content Area
- **Background:** `#f9fafb` (gray-50)
- **Padding:** `p-6`
- **Overflow:** scrollable vertically
- Content area shifts right to accommodate sidebar width

---

## 4. Color System

The app uses a CSS variable-based color system consumed via Tailwind CSS.
Theme switching is handled with `data-theme` attribute on `<html>`.

### Brand Palette

| Token       | Color Name | Main Value  | Hex       | Use Case                          |
|-------------|------------|-------------|-----------|-----------------------------------|
| `primary`   | Teal       | 500         | `#14b8a6` | CTAs, active states, links        |
| `secondary` | Emerald    | 500         | `#10b981` | Success highlights, accents       |
| `accent`    | Cyan       | 500         | `#06b6d4` | Hover states, secondary highlights|
| `success`   | Green      | 500         | `#22c55e` | Confirmations, positive feedback  |
| `warning`   | Amber      | 500         | `#f59e0b` | Cautions, pending states          |
| `error`     | Red        | 500         | `#ef4444` | Errors, destructive actions       |
| `info`      | Blue       | 500         | `#3b82f6` | Informational messages            |
| `gray`      | Neutral    | 50–950      | —         | Text, borders, backgrounds        |

### Key Color Values by Context

| Context                  | Light Theme            | Dark Theme             |
|--------------------------|------------------------|------------------------|
| Page background          | `#ffffff`              | `#111827` (gray-900)   |
| Secondary background     | `#f9fafb` (gray-50)    | `#1f2937` (gray-800)   |
| Sidebar background       | `#111827` (gray-900)   | `#030712` (gray-950)   |
| Sidebar active item bg   | `#0d9488` (primary-600)| `#0d9488` (primary-600)|
| TopBar background        | `#ffffff`              | `#111827` (gray-900)   |
| Card background          | `#ffffff`              | `#1f2937` (gray-800)   |
| Card border              | `#e5e7eb` (gray-200)   | `#374151` (gray-700)   |
| Primary text             | `#111827` (gray-900)   | `#f9fafb` (gray-50)    |
| Secondary text           | `#4b5563` (gray-600)   | `#d1d5db` (gray-300)   |
| Muted/tertiary text      | `#6b7280` (gray-500)   | `#9ca3af` (gray-400)   |
| Border (light)           | `#e5e7eb` (gray-200)   | `#374151` (gray-700)   |
| Border (medium)          | `#d1d5db` (gray-300)   | `#4b5563` (gray-600)   |
| Primary button bg        | `#14b8a6` (primary-500)| `#14b8a6` (primary-500)|
| Primary button hover     | `#0d9488` (primary-600)| `#0d9488` (primary-600)|
| Input background         | `#ffffff`              | `#1f2937` (gray-800)   |
| Input border             | `#d1d5db` (gray-300)   | `#374151` (gray-700)   |
| Focus ring               | `#14b8a6` (primary-500)| `#14b8a6` (primary-500)|

---

## 5. Typography

- **Font Family:** Inter (primary), `system-ui`, `-apple-system`, `sans-serif` (fallback)
- **Weight:** Regular (400), Medium (500), Semibold (600), Bold (700)

| Element            | Size  | Weight   | Color               |
|--------------------|-------|----------|---------------------|
| Page title / H1    | 24px  | Bold     | gray-900            |
| Section title / H2 | 20px  | Semibold | gray-900            |
| Card title / H3    | 16px  | Semibold | gray-900            |
| Body text          | 14px  | Regular  | gray-600            |
| Small / caption    | 12px  | Regular  | gray-500            |
| Label              | 14px  | Medium   | gray-700            |
| Badge / Tag        | 12px  | Medium   | varies by status    |

---

## 6. Component Styles

### Cards
- Background: `--card-bg` (white / gray-800 dark)
- Border: `1px solid --card-border`
- Border-radius: `rounded-xl` (12px)
- Shadow: `0 1px 3px rgba(0,0,0,0.05)` (light), `0 1px 3px rgba(0,0,0,0.3)` (dark)
- Hover shadow: slightly elevated (`card-hover` shadow)
- Padding: typically `p-6`

### Buttons
- **Primary:** bg `primary-500` (#14b8a6), hover `primary-600`, text white, `rounded-lg`
- **Secondary:** bg `secondary-500` (#10b981), hover `secondary-600`, text white
- **Ghost/Outline:** transparent bg, border `gray-300`, text `gray-700`, hover `gray-100` bg
- **Danger:** bg `error-500`, hover `error-600`, text white

### Badges / Status Pills
- `draft` → gray background, gray text
- `sent` → info-100 background, info-700 text (blue)
- `paid` → success-100 background, success-700 text (green)
- `overdue` → error-100 background, error-700 text (red)

### Inputs & Forms
- Border: `gray-300` / `gray-700` dark
- Focus: `primary-500` ring
- Border-radius: `rounded-lg`
- Background: white / gray-800 dark
- Label above input, 14px medium gray-700

### Navigation (Sidebar Items)
- Default: `gray-300` text, transparent bg
- Hover: `gray-700` bg, white text
- Active: `primary-600` (#0d9488) bg, white text, left border accent optional
- Font: 14px, medium weight when active

---

## 7. Dashboard Screen Context

The **Dashboard** (`/dashboard`) is the first screen a tenant user sees after login.
It is currently empty (placeholder) and needs to be designed.

### Dashboard Purpose
Give the business a **quick operational snapshot** of their data at a glance:
- Key business metrics (KPI cards)
- Recent invoices with status
- Quick customer activity
- Charts or trends over time

### Suggested Dashboard Layout (to be designed in Stitch)

```
┌─────────────────────────────────────────────────────────────────┐
│ TopBar: [☰]  Dashboard > /    [User Name] [Avatar]              │
├──────────┬──────────────────────────────────────────────────────┤
│          │  Welcome back, {Name}!        [Date / period filter] │
│ Sidebar  │ ─────────────────────────────────────────────────    │
│ (64/256) │  [KPI Card] [KPI Card] [KPI Card] [KPI Card]        │
│          │                                                      │
│ DS       │  ┌──────────────────────┐  ┌─────────────────────┐  │
│          │  │  Revenue Chart       │  │  Invoice Status     │  │
│ Dashboard│  │  (Line / Bar chart)  │  │  (Pie / Donut)      │  │
│ Invoices │  └──────────────────────┘  └─────────────────────┘  │
│ Customers│                                                      │
│          │  Recent Invoices                          [See all]  │
│          │  ┌─────────────────────────────────────────────────┐ │
│          │  │ # | Customer | Amount | Status | Due Date       │ │
│          │  └─────────────────────────────────────────────────┘ │
│          │                                                      │
│          │  Recent Customers                         [See all]  │
│          │  ┌─────────────────────────────────────────────────┐ │
│          │  │ Name | Email | Phone | Joined                   │ │
│          │  └─────────────────────────────────────────────────┘ │
└──────────┴──────────────────────────────────────────────────────┘
```

### KPI Cards (4 cards in a row)
1. **Total Revenue** — sum of paid invoices, trend arrow (↑ / ↓)
2. **Pending Invoices** — count of `sent` or `draft` invoices
3. **Overdue Invoices** — count of `overdue` invoices (error color accent)
4. **Total Customers** — total customer count, growth vs last month

Each KPI card:
- White card (dark: gray-800), rounded-xl, shadow
- Large number (24px bold, gray-900)
- Label below (14px, gray-500)
- Small trend indicator (green/red)
- Icon top-right (teal/emerald toned)

---

## 8. Data Models (Relevant to Dashboard)

### Invoice
```ts
{
  id: string
  number: string        // e.g. "INV-0042"
  customerId: string
  amount: number        // monetary value
  status: 'draft' | 'sent' | 'paid' | 'overdue'
  issuedAt: string      // ISO date
  dueAt: string         // ISO date
}
```

### Customer
```ts
{
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  createdAt: string     // ISO date
}
```

---

## 9. Tech Stack (Frontend)

| Tool             | Purpose                                     |
|------------------|---------------------------------------------|
| React 19         | UI framework                                |
| TypeScript       | Type safety                                 |
| Vite             | Build tool / dev server                     |
| Tailwind CSS v4  | Utility-first styling                       |
| PrimeReact       | UI component library (tables, inputs, etc.) |
| React Router v7  | Client-side routing                         |
| Zustand          | Global state (auth, UI, menu)               |
| Axios            | HTTP client                                 |
| i18next          | Internationalization (EN / ES)              |
| FontAwesome      | Icon library                                |
| PrimeIcons       | Additional icon set (PrimeReact native)     |
| Formik + Yup     | Form handling and validation                |

---

## 10. Design Principles

- **Consistency:** Always use the defined color tokens — never hardcode hex values.
- **Clarity:** Prioritize data readability; the user needs to understand numbers fast.
- **Density:** Medium information density — not too sparse, not too cluttered.
- **Dual Theme:** Every screen must work in both **light** and **dark** themes.
- **Responsive:** Sidebar collapses for narrow screens; content adapts.
- **Accessible:** Sufficient contrast ratios, keyboard navigable, ARIA labels on icons.

---

## 11. What to Design (Stitch Scope)

Focus the design on the **Tenant Dashboard screen only** (`/dashboard`):

1. The outer shell (Sidebar + TopBar) is already built — you can reference it for context.
2. Design the **main content area** inside the shell.
3. Must include:
   - Page title + welcome message + optional date/period filter
   - 4 KPI summary cards (row)
   - 1 revenue/trend chart + 1 invoice status breakdown chart (side by side)
   - Recent invoices table (last 5–10)
   - Recent customers list (last 5)
4. Style must match the teal (`#14b8a6`) primary brand color.
5. Design should support both light and dark modes.
