import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { PrimeReactProvider } from 'primereact/api'

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

import { ErrorBoundary } from '@/shared/components/ErrorBoundary'
import { AppRouter } from './AppRouter'
import { initializeTheme } from '@/shared/store/ui.store'
import { useLanguageStore } from '@/shared/store/language.store'

function Root() {
  const fetchLanguages = useLanguageStore((state) => state.fetchLanguages)

  useEffect(() => {
    initializeTheme()
    fetchLanguages()
  }, [fetchLanguages])

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </ErrorBoundary>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PrimeReactProvider>
      <Root />
    </PrimeReactProvider>
  </StrictMode>
)
