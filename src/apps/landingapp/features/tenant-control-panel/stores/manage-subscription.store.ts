// manage-subscription.store.ts — Zustand store for the Manage Subscription page.
// "Cubit equivalent" — single-subscription detail state, fetched by ID via the
// dedicated endpoint (returns the subscription regardless of status, unlike
// the list endpoint which excludes CANCELLED). Mirrors checkout-review.store.

import { create } from 'zustand'
import { subscriptionsService } from '../services/subscriptions.service'
import { getErrorMessage } from '@/shared/utils/api.utils'
import type { SubscriptionResponse } from '../types/subscriptions.types'

type ManageSubscriptionState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: SubscriptionResponse }
  | { status: 'error';   message: string }

type ManageSubscriptionStore = ManageSubscriptionState & {
  fetchSubscription: (subscriptionId: number, language: string) => Promise<void>
  reset:             () => void
}

export const useManageSubscriptionStore = create<ManageSubscriptionStore>((set) => ({
  status: 'idle',

  fetchSubscription: async (subscriptionId: number, language: string) => {
    set({ status: 'loading' })
    const { data: result } = await subscriptionsService.getSubscriptionById(
      subscriptionId, language,
    )
    if (result.success) {
      set({ status: 'success', data: result.data })
    } else {
      set({ status: 'error', message: getErrorMessage(result.error) })
    }
  },

  reset: () => set({ status: 'idle' }),
}))
