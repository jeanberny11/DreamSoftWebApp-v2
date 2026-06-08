import { useEffect } from 'react'
import { useLanguageStore } from '@/shared/store/language.store'
import { useBillingCyclesStore } from '../stores/billing-cycles.store'


export function useBillingCycles() {
  const langCode = useLanguageStore((s) => s.currentLanguage.code)
  const { fetch } = useBillingCyclesStore()

  useEffect(() => {
    fetch(langCode.toUpperCase())
  }, [langCode])

  return useBillingCyclesStore()
}
