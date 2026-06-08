import { useEffect } from 'react'
import { useLanguageStore } from '@/shared/store/language.store'
import { useSolutionsStore } from '../stores/solutions.store'

export function useSolutions() {
  const langCode = useLanguageStore((s) => s.currentLanguage.code)
  const { fetch } = useSolutionsStore()

  useEffect(() => {
    fetch(langCode.toUpperCase())
  }, [langCode, fetch])

  return useSolutionsStore()
}
