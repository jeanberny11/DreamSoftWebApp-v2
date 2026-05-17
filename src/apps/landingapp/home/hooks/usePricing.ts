// usePricing — fetches pricing solutions from the API

import { useEffect, useState } from 'react'
import { homeApi } from '../services/home.api'
import { getErrorMessage } from '@/shared/utils/api.utils'
import type { PricingSolution } from '../types/home.types'
import { useLanguageStore } from '@/shared/store/language.store'

export function usePricing() {
  const [solutions, setSolutions] = useState<PricingSolution[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError]         = useState<string | null>(null)
  const langCode = useLanguageStore((s) => s.currentLanguage.code)

  useEffect(() => {
    homeApi.getPricing(langCode.toUpperCase()).then((res) => {
      const result = res.data
      if (result.success) {
        setSolutions(result.data)
      } else {
        setError(getErrorMessage(result.error))
      }
    }).finally(() => setIsLoading(false))
  }, [langCode])

  return { solutions, isLoading, error }
}
