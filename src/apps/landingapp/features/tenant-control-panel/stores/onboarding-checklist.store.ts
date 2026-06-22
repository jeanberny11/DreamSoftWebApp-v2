import { create } from 'zustand'
import { onboardingApi } from '../services/tenant-control-panel.service'
import { getErrorMessage } from '@/shared/utils/api.utils'
import type { OnboardingChecklistResponse } from '../types/tenant-control-panel.types'

type OnboardingChecklistStoreState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: OnboardingChecklistResponse }
  | { status: 'error';   message: string }

type OnboardingChecklistStore = OnboardingChecklistStoreState & {
  fetchChecklist: () => Promise<void>
  reset:          () => void
}

export const useOnboardingChecklistStore = create<OnboardingChecklistStore>((set) => ({
  status: 'idle',

  fetchChecklist: async () => {
    set({ status: 'loading' })
    const { data: result } = await onboardingApi.getChecklist()
    if (result.success) {
      set({ status: 'success', data: result.data })
    } else {
      set({ status: 'error', message: getErrorMessage(result.error) })
    }
  },

  reset: () => set({ status: 'idle' }),
}))
