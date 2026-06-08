# DreamSoft WebApp — Project Structure Reference

## App Folder Conventions

Both apps follow the same feature-based structure:

```
src/apps/
├── landingapp/
│   └── features/
│       ├── login/
│       ├── register/
│       ├── dashboard/
│       └── <feature>/
│           ├── components/   ← Reusable UI pieces
│           ├── pages/        ← Full page views
│           ├── hooks/
│           ├── services/
│           ├── store/
│           ├── styles/       ← CSS files for this feature
│           ├── types/
│           └── utils/
└── tenant/
    └── features/
        ├── customers/
        ├── invoices/
        └── <feature>/
            ├── components/
            ├── pages/
            ├── hooks/
            ├── services/
            ├── stores/
            ├── styles/       ← CSS files for this feature
            ├── types/
            └── utils/
```

> Note: `landingapp` currently has some features at `landingapp/<feature>/` (legacy).
> All new features must be created under `landingapp/features/<feature>/`.

---

## File Placement Rules

| Design type | TSX destination | CSS destination |
|-------------|-----------------|-----------------|
| Page        | `apps/<app>/features/<feature>/pages/<Name>Page.tsx` | `apps/<app>/features/<feature>/styles/<name>.css` |
| Component   | `apps/<app>/features/<feature>/components/<Name>.tsx` | `apps/<app>/features/<feature>/styles/<name>.css` |

- Page file names: `PascalCase` + `Page` suffix → e.g. `CustomerListPage.tsx`
- Component file names: `PascalCase` → e.g. `CustomerCard.tsx`
- CSS file names: `kebab-case` matching the component/page → e.g. `customer-card.css`

---

## CSS Variables

All CSS variables are defined in:
```
src/styles/variables.css
```

Always read this file before replacing hardcoded values to know which variables already exist.

### Variable naming convention
```css
--color-primary-500       /* palette colors */
--color-text-primary      /* semantic text */
--color-bg-primary        /* semantic backgrounds */
--color-border-light      /* semantic borders */
--btn-primary-bg          /* component-specific */
--card-bg                 /* component-specific */
--sidebar-bg              /* component-specific */
```

If a needed variable does not exist, add it to `variables.css` under the appropriate section comment, following the naming convention above.

---

## i18n Namespace Mapping

Translation files live in:
```
src/shared/i18n/locales/
├── en/
│   ├── common.json
│   ├── auth.json
│   ├── validation.json
│   ├── landing.json
│   └── dashboard.json
└── es/
    └── (same files)
```

### Namespace selection rules

| Feature / Context                              | Namespace      |
|------------------------------------------------|----------------|
| login, register, forgot password, reset        | `auth`         |
| landing home, hero, pricing, features sections | `landing`      |
| tenant dashboard, sidebar, topbar, KPIs        | `dashboard`    |
| buttons, nav links, shared labels, errors      | `common`       |
| form validation messages                       | `validation`   |
| New feature with no matching namespace         | Create new     |

### Creating a new namespace
If no existing namespace fits the feature context:
1. Create `src/shared/i18n/locales/en/<namespace>.json`
2. Create `src/shared/i18n/locales/es/<namespace>.json`
3. Register the new namespace in `src/shared/i18n/config.ts` under `resources` and `ns`

### i18n key naming convention
```json
{
  "section": {
    "title": "...",
    "subtitle": "...",
    "actions": {
      "save": "...",
      "cancel": "..."
    },
    "labels": {
      "name": "...",
      "email": "..."
    }
  }
}
```

Keys must be added to **both `en/` and `es/`** files simultaneously.

### Usage in component
```tsx
import { useTranslation } from 'react-i18next'

const { t } = useTranslation('auth')
// cross-namespace:
const { t } = useTranslation(['common', 'auth'])

return <p>{t('login.title')}</p>
```
