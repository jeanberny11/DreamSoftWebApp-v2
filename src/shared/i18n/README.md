# i18n — Internationalization

## Overview

i18next + react-i18next. Languages are fetched from the API at runtime.
The `LanguageSwitcher` in the landing `Navbar` lets users switch language manually.

## Namespaces

| Namespace    | Purpose                                      | Used in              |
|--------------|----------------------------------------------|----------------------|
| `common`     | Shared labels: buttons, nav, errors, footer  | Everywhere           |
| `auth`       | Login, register, forgot/reset password       | Auth pages           |
| `validation` | Form error messages                          | All forms            |
| `landing`    | Landing page copy: hero, features, pricing   | `apps/landing/`      |
| `dashboard`  | Tenant app labels: sidebar, topbar, modules  | `apps/tenant/`       |

## How to use translations in a component

```tsx
import { useTranslation } from 'react-i18next'

export function MyComponent() {
  const { t } = useTranslation('common')       // single namespace
  // or
  const { t } = useTranslation(['common', 'auth']) // multiple namespaces

  return <p>{t('actions.save')}</p>
  // cross-namespace: t('auth:login.title')
}
```

## How to add a new language

1. Add locale files under `locales/<code>/` — one file per namespace.
2. Import and register them in `config.ts` under `resources`.
3. The new language will appear in `LanguageSwitcher` automatically once the API returns it.

## Language resolution order

1. API default (`isDefault: true` from `/api/v1/admin/Languages/active`)
2. Fallback on API failure: `es`
3. Fallback for missing translation keys: always `es`

## File structure

```
shared/i18n/
├── config.ts             # i18next initialization
├── index.ts              # Barrel export
├── types.ts              # Language type + fallback constants
├── languages.service.ts  # API call to GET /api/v1/admin/Languages/active
├── useLanguages.ts       # Hook: fetches languages, sets default on boot
├── README.md             # This file
└── locales/
    ├── en/
    │   ├── common.json
    │   ├── auth.json
    │   ├── validation.json
    │   ├── landing.json
    │   └── dashboard.json
    └── es/
        ├── common.json
        ├── auth.json
        ├── validation.json
        ├── landing.json
        └── dashboard.json
```
