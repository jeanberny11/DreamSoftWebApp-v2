// sendVerificationCode.store.ts — Zustand store for the send verification code flow
//
// Responsibilities:
//   - Calls sendCode() API and manages send state
//   - Tracks secondsRemaining (server-driven from expiresAt)
//   - Tracks resendCooldown (frontend-only, 120s to match backend 2-min rate limit)
//   - Exposes reset() to clear everything back to idle

import { create } from 'zustand'
import { verifyEmailApi } from '@/apps/landingapp/common/api/verify-email.api'
import { getErrorMessage } from '@/shared/utils/api.utils'
import type { SendVerificationCodeState } from './sendVerificationCode.state'

interface SendVerificationCodeStore {
  // State
  state:            SendVerificationCodeState

  // Timers
  secondsRemaining: number        // calculated from server expiresAt — counts to 0
  resendCooldown:   number        // frontend only — 120s after each send

  // Internal timer refs (not exposed to UI)
  _expiryTimer:     ReturnType<typeof setInterval> | null
  _cooldownTimer:   ReturnType<typeof setInterval> | null

  // Actions
  sendCode:         () => Promise<void>
  reset:            () => void
}

export const useSendVerificationCodeStore = create<SendVerificationCodeStore>((set, get) => ({
  state:            { status: 'idle' },
  secondsRemaining: 0,
  resendCooldown:   0,
  _expiryTimer:     null,
  _cooldownTimer:   null,

  sendCode: async () => {
    // Prevent resend while cooldown is still active
    if (get().resendCooldown > 0) return

    // Clear any existing timers before sending
    const { _expiryTimer, _cooldownTimer } = get()
    if (_expiryTimer)   clearInterval(_expiryTimer)
    if (_cooldownTimer) clearInterval(_cooldownTimer)

    set({ state: { status: 'sending' } })

    const result = await verifyEmailApi.sendCode()

    if (!result.data.success) {
      set({ state: { status: 'error', message: getErrorMessage(result.data.error) } })
      return
    }

    // Calculate secondsRemaining from server expiresAt
    const expiresAt        = new Date(result.data.data.expiresAt)
    const secondsRemaining = Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / 1000))

    // Start expiry countdown
    const expiryTimer = setInterval(() => {
      const current = get().secondsRemaining
      if (current <= 1) {
        clearInterval(get()._expiryTimer!)
        set({ secondsRemaining: 0 })
      } else {
        set({ secondsRemaining: current - 1 })
      }
    }, 1000)

    // Start resend cooldown (120s)
    const cooldownTimer = setInterval(() => {
      const current = get().resendCooldown
      if (current <= 1) {
        clearInterval(get()._cooldownTimer!)
        set({ resendCooldown: 0 })
      } else {
        set({ resendCooldown: current - 1 })
      }
    }, 1000)

    set({
      state:            { status: 'codeSent' },
      secondsRemaining,
      resendCooldown:   120,
      _expiryTimer:     expiryTimer,
      _cooldownTimer:   cooldownTimer,
    })
  },

  reset: () => {
    const { _expiryTimer, _cooldownTimer } = get()
    if (_expiryTimer)   clearInterval(_expiryTimer)
    if (_cooldownTimer) clearInterval(_cooldownTimer)

    set({
      state:            { status: 'idle' },
      secondsRemaining: 0,
      resendCooldown:   0,
      _expiryTimer:     null,
      _cooldownTimer:   null,
    })
  },
}))
