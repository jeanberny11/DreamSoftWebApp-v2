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
  fetchSubscriptions: () => Promise<void>
  reset:              () => void
}

export const useSubscriptionsStore = create<SubscriptionsStore>((set) => ({
  status: 'idle',

  fetchSubscriptions: async () => {
    set({ status: 'loading' })
    const { data: result } = await subscriptionsService.getSubscriptions()
    if (result.success) {
      set({ status: 'success', data: result.data })
    } else {
      set({ status: 'error', message: getErrorMessage(result.error) })
    }
  },

  reset: () => set({ status: 'idle' }),
}))
