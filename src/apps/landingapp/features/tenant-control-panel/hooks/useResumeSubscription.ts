// useResumeSubscription — reverts a pending period-end cancellation via
// POST /resume ("Keep my subscription"). Resolves true on success so the
// caller can refetch; errors surface as local state for inline display.

import { useState } from 'react'
import { subscriptionsService } from '../services/subscriptions.service'
import { getErrorMessage } from '@/shared/utils/api.utils'

type ResumeSubscriptionState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'error'; message: string }

export function useResumeSubscription() {
  const [state, setState] = useState<ResumeSubscriptionState>({ status: 'idle' })

  const resume = async (subscriptionId: number): Promise<boolean> => {
    setState({ status: 'submitting' })
    const { data: result } = await subscriptionsService.resumeSubscription(subscriptionId)
    if (result.success) {
      setState({ status: 'idle' })
      return true
    }
    setState({ status: 'error', message: getErrorMessage(result.error) })
    return false
  }

  return { state, resume }
}
