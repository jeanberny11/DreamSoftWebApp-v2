import { useEffect } from 'react'
import { useLanguageStore } from '@/shared/store/language.store'
import { usePricingStore } from '../stores/pricing.store'

export function usePricing() {
  const langCode = useLanguageStore((s) => s.currentLanguage.code)
  const { fetch } = usePricingStore()

  useEffect(() => {
    fetch(langCode.toUpperCase())
  }, [langCode])

  return usePricingStore()
}
