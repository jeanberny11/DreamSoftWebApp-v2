import { StrictMode }        from 'react'
import { createRoot }        from 'react-dom/client'
import { Provider }          from 'react-redux'
import { PrimeReactProvider } from 'primereact/api'
import { store }             from '@/shared/store/store'

// Initialize i18n before rendering — must be imported before any component
// that uses useTranslation()
import '@/shared/i18n/config'

// ── PrimeReact theme & core ──────────────────────────────────────────────────
import 'primereact/resources/themes/lara-light-teal/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'

// ── App styles ───────────────────────────────────────────────────────────────
// Imports: variables.css → themes/light.css → themes/dark.css → primereact-theme.css
import './styles/index.css'
import './index.css'

import { Root } from './Root'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PrimeReactProvider>
        <Root />
      </PrimeReactProvider>
    </Provider>
  </StrictMode>
)
