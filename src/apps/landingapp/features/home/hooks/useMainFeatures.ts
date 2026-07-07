import { useEffect } from 'react'
import { useLanguageStore } from '@/shared/store/language.store'
import { useMainFeaturesStore } from '../stores/main-features.store'

export function useMainFeatures() {
  const langCode = useLanguageStore((s) => s.currentLanguage.code)
  const { fetch } = useMainFeaturesStore()

  useEffect(() => {
    fetch(langCode.toUpperCase())
  }, [langCode])

  return useMainFeaturesStore()
}
