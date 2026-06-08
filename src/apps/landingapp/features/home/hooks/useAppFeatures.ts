// useAppFeatures — fetches app feature groups from the API

import { useEffect, useState } from 'react'
import { homeApi } from '../services/home.api'
import { getErrorMessage } from '@/shared/utils/api.utils'
import type { AppFeature } from '../types/home.types'
import { useLanguageStore } from '@/shared/store/language.store'

export function useAppFeatures() {
  const [features, setFeatures]   = useState<AppFeature[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError]         = useState<string | null>(null)
  const langCode = useLanguageStore((s) => s.currentLanguage.code)

  useEffect(() => {
    homeApi.getAppFeatures(langCode.toUpperCase()).then((res) => {
      const result = res.data
      if (result.success) {
        setFeatures(result.data)
      } else {
        setError(getErrorMessage(result.error))
      }
    }).finally(() => setIsLoading(false))
  }, [langCode])

  return { features, isLoading, error }
}
