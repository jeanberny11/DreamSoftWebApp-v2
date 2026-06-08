import { useEffect } from 'react'
import { useFeaturesCatalogStore } from '../stores/features-catalog.store'

export function useFeaturesCatalog() {
  const { fetch, reset } = useFeaturesCatalogStore()

  useEffect(() => {
    fetch()
    return () => reset()
  }, [fetch, reset])

  return useFeaturesCatalogStore()
}
