import { create } from 'zustand'
import { homeApi } from '../services/home.api'
import { getErrorMessage } from '@/shared/utils/api.utils'
import type { SolutionDto } from '@/apps/landingapp/common/types/catalog.types'

type SolutionsState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: SolutionDto[] }
  | { status: 'error';   message: string }

type SolutionsStore = SolutionsState & {
  fetch: (language: string) => Promise<void>
  reset: () => void
}

export const useSolutionsStore = create<SolutionsStore>((set) => ({
  status: 'idle',

  fetch: async (language: string) => {
    set({ status: 'loading' })
    const res = await homeApi.getAllActiveSolutionsWithFeatures(language)
    const result = res.data
    if (result.success) {
      set({ status: 'success', data: result.data })
    } else {
      set({ status: 'error', message: getErrorMessage(result.error) })
    }
  },

  reset: () => set({ status: 'idle' }),
}))
