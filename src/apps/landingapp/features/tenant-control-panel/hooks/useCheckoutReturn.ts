// useCheckoutReturn — handles the return trip from Stripe hosted checkout.
//
// When the URL carries ?checkout=success (set by the backend's per-request
// SuccessUrl), shows an "activating" banner and silently polls the
// subscriptions list until webhook-driven activation completes (no
// subscription left in PROCESSING_PAYMENT), then flips to "success".
// If activation takes longer than the polling window, flips to "delayed" —
// the webhook will still complete it; the user can refresh later.
//
// The checkout/session_id params are stripped from the URL immediately;
// banner state lives in memory so refreshing the page doesn't re-trigger it.

import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useLanguageStore } from '@/shared/store/language.store'
import { useSubscriptionsStore } from '../stores/subscriptions.store'
import { SUBSCRIPTION_STATUS } from '../types/subscriptions.types'

const POLL_INTERVAL_MS = 4000
const MAX_POLL_ATTEMPTS = 5

export type CheckoutReturnBanner = 'activating' | 'success' | 'delayed' | null

export function useCheckoutReturn() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [banner, setBanner] = useState<CheckoutReturnBanner>(() =>
    searchParams.get('checkout') === 'success' ? 'activating' : null,
  )
  const langCode = useLanguageStore((s) => s.currentLanguage.code)
  const store = useSubscriptionsStore()
  const attemptsRef = useRef(0)

  // Strip checkout params from the URL once — banner survives in memory only
  useEffect(() => {
    if (searchParams.has('checkout') || searchParams.has('session_id')) {
      const next = new URLSearchParams(searchParams)
      next.delete('checkout')
      next.delete('session_id')
      setSearchParams(next, { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Poll while activating
  useEffect(() => {
    if (banner !== 'activating') return

    if (
      store.status === 'success' &&
      !store.data.some(
        (s) => s.statusCode === SUBSCRIPTION_STATUS.PROCESSING_PAYMENT,
      )
    ) {
      setBanner('success')
      return
    }

    if (attemptsRef.current >= MAX_POLL_ATTEMPTS) {
      setBanner('delayed')
      return
    }

    const timer = setTimeout(() => {
      attemptsRef.current += 1
      useSubscriptionsStore.getState().refetchSilently(langCode.toUpperCase())
    }, POLL_INTERVAL_MS)

    return () => clearTimeout(timer)
  }, [banner, store, langCode])

  return { banner, dismiss: () => setBanner(null) }
}
