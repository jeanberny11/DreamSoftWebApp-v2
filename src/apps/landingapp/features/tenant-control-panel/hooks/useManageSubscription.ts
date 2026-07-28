// useManageSubscription — resolves :subscriptionId via the dedicated
// GET-by-id endpoint through manage-subscription.store. Invalid (non-numeric)
// params redirect to the list; API errors (incl. not-found) surface as the
// page's error state. Resets the store on unmount so stale data never flashes
// when managing a different subscription later.

import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useLanguageStore } from '@/shared/store/language.store'
import { useManageSubscriptionStore } from '../stores/manage-subscription.store'

export function useManageSubscription() {
  const { subscriptionId } = useParams()
  const navigate = useNavigate()
  const langCode = useLanguageStore((s) => s.currentLanguage.code)
  const store = useManageSubscriptionStore()

  const id = Number(subscriptionId)
  const idValid = Number.isInteger(id) && id > 0

  useEffect(() => {
    if (!idValid) {
      navigate('/account/subscriptions', { replace: true })
      return
    }
    store.fetchSubscription(id, langCode.toUpperCase())
    return () => useManageSubscriptionStore.getState().reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, idValid, langCode])

  return {
    status: store.status,
    subscription: store.status === 'success' ? store.data : null,
    errorMessage: store.status === 'error' ? store.message : null,
    refetch: () => {
      if (idValid) store.fetchSubscription(id, langCode.toUpperCase())
    },
  }
}
