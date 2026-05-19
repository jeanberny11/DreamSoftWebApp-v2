import { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { ErrorBoundary } from '@/shared/components/ErrorBoundary'
import { AppRouter } from './AppRouter'
import { initializeTheme } from '@/shared/store/ui.store'
import { useLanguageStore } from '@/shared/store/language.store'

export function Root() {
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
