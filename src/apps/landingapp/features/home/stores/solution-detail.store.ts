import { create } from 'zustand'
import { homeApi } from '../services/home.api'
import { getErrorMessage } from '@/shared/utils/api.utils'
import type { SolutionDto } from '../types/home.types'

type SolutionDetailState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: SolutionDto }
  | { status: 'error';   message: string }

type SolutionDetailStore = SolutionDetailState & {
  fetch: (code: string) => Promise<void>
  reset: () => void
}

export const useSolutionDetailStore = create<SolutionDetailStore>((set) => ({
  status: 'idle',

  fetch: async (code: string) => {
    set({ status: 'loading' })
    const res = await homeApi.getSolutionDetail(code)
    const result = res.data
    if (result.success) {
      set({ status: 'success', data: result.data })
    } else {
      set({ status: 'error', message: getErrorMessage(result.error) })
    }
  },

  reset: () => set({ status: 'idle' }),
}))
