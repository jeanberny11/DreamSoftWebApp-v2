import { useEffect } from 'react'
import { useLanguageStore } from '@/shared/store/language.store'
import { useFeaturesCatalogStore } from '../stores/features-catalog.store'

export function useFeaturesCatalog() {
  const langCode = useLanguageStore((s) => s.currentLanguage.code)
  const { fetch, reset } = useFeaturesCatalogStore()

  useEffect(() => {
    fetch(langCode.toUpperCase())
    return () => reset()
  }, [langCode])

  const retry = () => fetch(langCode.toUpperCase())

  return { ...useFeaturesCatalogStore(), retry }
}
