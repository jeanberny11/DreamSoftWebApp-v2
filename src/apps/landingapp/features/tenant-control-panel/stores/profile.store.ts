// profile.store.ts — Zustand store for the Tenant Profile feature (GET)
//
// "Cubit equivalent" — handles read/display state for the profile.
// Shared by both ProfileSection (view page) and ProfileEditPage (pre-fill).
// Mirrors onboarding-checklist.store.ts exactly.

import { create } from 'zustand'
import { profileService } from '../services/profile.service'
import { getErrorMessage } from '@/shared/utils/api.utils'
import type { ProfileResponse } from '../types/profile.types'

type ProfileStoreState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: ProfileResponse }
  | { status: 'error';   message: string }

type ProfileStore = ProfileStoreState & {
  fetchProfile: () => Promise<void>
  reset:        () => void
}

export const useProfileStore = create<ProfileStore>((set) => ({
  status: 'idle',

  fetchProfile: async () => {
    set({ status: 'loading' })
    const { data: result } = await profileService.getProfile()
    if (result.success) {
      set({ status: 'success', data: result.data })
    } else {
      set({ status: 'error', message: getErrorMessage(result.error) })
    }
  },

  reset: () => set({ status: 'idle' }),
}))
