import { create } from 'zustand'
import { homeApi } from '../services/home.api'
import { getErrorMessage } from '@/shared/utils/api.utils'
import type { PricingSolution } from '../types/home.types'

type PricingState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: PricingSolution[] }
  | { status: 'error';   message: string }

type PricingStore = PricingState & {
  fetch: (language: string) => Promise<void>
  reset: () => void
}

export const usePricingStore = create<PricingStore>((set) => ({
  status: 'idle',

  fetch: async (language: string) => {
    set({ status: 'loading' })
    const res = await homeApi.getPricing(language)
    const result = res.data
    if (result.success) {
      set({ status: 'success', data: result.data })
    } else {
      set({ status: 'error', message: getErrorMessage(result.error) })
    }
  },

  reset: () => set({ status: 'idle' }),
}))
