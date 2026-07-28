import { useEffect } from 'react'
import { useLanguageStore } from '@/shared/store/language.store'
import { useSubscriptionsStore } from '../stores/subscriptions.store'


export function useSubscriptions() {
  const langCode = useLanguageStore((s) => s.currentLanguage.code)
  const { fetchSubscriptions, status } = useSubscriptionsStore()

  useEffect(() => {
    if (status === 'idle') {
      fetchSubscriptions(langCode.toUpperCase())
    }
  }, [langCode])

  return useSubscriptionsStore()
}
