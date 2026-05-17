// useSolutions — fetches active solutions from the API

import { useEffect, useState } from 'react'
import { homeApi } from '../services/home.api'
import { getErrorMessage } from '@/shared/utils/api.utils'
import type { Solution } from '../types/home.types'
import { useLanguageStore } from '@/shared/store/language.store'

export function useSolutions() {
  const [solutions, setSolutions] = useState<Solution[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError]         = useState<string | null>(null)
  const currentLanguage = useLanguageStore((state) => state.currentLanguage)
  const language = currentLanguage?.code.toUpperCase() || 'ES'

  useEffect(() => {
    homeApi.getSolutions(language).then((res) => {
      const result = res.data
      if (result.success) {
        setSolutions(result.data)
      } else {
        setError(getErrorMessage(result.error))
      }
    }).finally(() => setIsLoading(false))
  }, [language])

  return { solutions, isLoading, error }
}
