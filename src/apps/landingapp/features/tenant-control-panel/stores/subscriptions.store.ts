// subscriptions.store.ts — Zustand store for the Tenant Subscriptions feature (GET)
//
// "Cubit equivalent" — handles read/display state for the subscriptions list.
// Mirrors profile.store.ts exactly.

import { create } from 'zustand'
import { subscriptionsService } from '../services/subscriptions.service'
import { getErrorMessage } from '@/shared/utils/api.utils'
import type { SubscriptionResponse } from '../types/subscriptions.types'

type SubscriptionsStoreState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: SubscriptionResponse[] }
  | { status: 'error';   message: string }

type SubscriptionsStore = SubscriptionsStoreState & {
  fetchSubscriptions: (language: string) => Promise<void>
  refetchSilently:    (language: string) => Promise<void>
  reset:              () => void
}

export const useSubscriptionsStore = create<SubscriptionsStore>((set) => ({
  status: 'idle',

  fetchSubscriptions: async (language: string) => {
    set({ status: 'loading' })
    const { data: result } = await subscriptionsService.getSubscriptions(language)
    if (result.success) {
      set({ status: 'success', data: result.data })
    } else {
      set({ status: 'error', message: getErrorMessage(result.error) })
    }
  },

  // Background refresh used while waiting for webhook-driven activation
  // after returning from Stripe. Never enters 'loading' (no UI flash) and
  // silently keeps the last good data on transient errors.
  refetchSilently: async (language: string) => {
    const { data: result } = await subscriptionsService.getSubscriptions(language)
    if (result.success) {
      set({ status: 'success', data: result.data })
    }
  },

  reset: () => set({ status: 'idle' }),
}))
