# Color Guide

All colors are defined as CSS variables in `variables.css` and consumed via Tailwind in `tailwind.config.js`.

## Palette

| Token       | Purpose                        |
|-------------|--------------------------------|
| `primary`   | Teal — brand, CTAs, links      |
| `secondary` | Emerald — success, highlights  |
| `accent`    | Cyan — accents, hover states   |
| `success`   | Confirmations, positive states |
| `warning`   | Caution, pending states        |
| `error`     | Destructive, validation errors |
| `info`      | Informational messages         |
| `gray`      | Neutral UI, text, borders      |

## Usage Rules

- Always use Tailwind color tokens (`text-primary-500`, `bg-error-50`) — never hardcode hex values in components.
- Use `data-theme` attribute on `<html>` to switch between `light` and `dark` themes.
- Theme switching is handled by `ui.store.ts` → `setTheme()`.
- PrimeReact component theme overrides live in `primereact-theme.css`.
