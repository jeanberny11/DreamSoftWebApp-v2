// useRetryPayment — restarts Stripe checkout for a subscription stuck in
// PROCESSING_PAYMENT or PAYMENT_FAILED. On success the backend returns a
// fresh checkout URL (with the new per-request success/cancel URLs) and we
// redirect the browser to Stripe.

import { useState } from 'react'
import { subscriptionsService } from '../services/subscriptions.service'
import { getErrorMessage } from '@/shared/utils/api.utils'

type RetryPaymentState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'error'; message: string }

export function useRetryPayment() {
  const [state, setState] = useState<RetryPaymentState>({ status: 'idle' })

  const retry = async (subscriptionId: number) => {
    setState({ status: 'submitting' })
    const { data: result } = await subscriptionsService.retryPayment(subscriptionId)
    if (result.success) {
      window.location.href = result.data.checkoutUrl
    } else {
      setState({ status: 'error', message: getErrorMessage(result.error) })
    }
  }

  return { state, retry }
}
