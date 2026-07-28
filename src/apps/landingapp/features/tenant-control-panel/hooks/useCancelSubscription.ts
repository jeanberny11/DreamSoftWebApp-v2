// useCancelSubscription — cancels a subscription (period-end or immediate)
// via POST /cancel. Resolves true on success so the caller can close the
// modal and refetch; errors surface as local state for inline display.

import { useState } from 'react'
import { subscriptionsService } from '../services/subscriptions.service'
import { getErrorMessage } from '@/shared/utils/api.utils'

type CancelSubscriptionState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'error'; message: string }

export function useCancelSubscription() {
  const [state, setState] = useState<CancelSubscriptionState>({ status: 'idle' })

  const cancel = async (
    solutionId: number,
    cancelImmediately: boolean,
    reason?: string,
    feedback?: string,
  ): Promise<boolean> => {
    setState({ status: 'submitting' })
    const { data: result } = await subscriptionsService.cancelSubscription(
      solutionId, cancelImmediately, reason, feedback,
    )
    if (result.success) {
      setState({ status: 'idle' })
      return true
    }
    setState({ status: 'error', message: getErrorMessage(result.error) })
    return false
  }

  return { state, cancel }
}
