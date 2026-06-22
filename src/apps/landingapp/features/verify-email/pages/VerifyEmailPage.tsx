// VerifyEmailPage.tsx — Email verification OTP page
//
// Switches on two stores — equivalent to two BlocBuilders stacked:
//   senderStore.state.status  → controls send flow (icon, send error banner, resend)
//   verifyEmailState.status   → controls verify flow (inputs, button, feedback)
//
// OTP input behaviour:
//   - Auto-focus next box on digit entry
//   - Backspace moves focus to previous box
//   - Paste fills all 6 boxes at once
//   - Verify button activates only when all 6 boxes are filled
//   - Inputs disabled while verifying or on success

import { useRef, useState, useCallback, useEffect } from 'react'
import { Link }                                      from 'react-router-dom'
import { useTranslation }                            from 'react-i18next'
import { useVerifyEmail }                            from '../hooks/useVerifyEmail'
import { useTenantAuthStore }                        from '@/apps/landingapp/common/tenant_auth.store'
import '../styles/verify-email.css'

const CODE_LENGTH = 6

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatSeconds(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

function getTimerClass(seconds: number): string {
  if (seconds === 0)   return 'verify-email-timer-value is-expired'
  if (seconds <= 60)   return 'verify-email-timer-value is-warning'
  return 'verify-email-timer-value'
}

// ── Component ─────────────────────────────────────────────────────────────────

export function VerifyEmailPage() {
  const { t }                               = useTranslation('auth')
  const { verifyEmailState, verifyCode,
          senderStore }                     = useVerifyEmail()
  const session                             = useTenantAuthStore(s => s.session)

  // Local OTP digits state
  const [digits, setDigits]                 = useState<string[]>(Array(CODE_LENGTH).fill(''))
  const inputRefs                           = useRef<(HTMLInputElement | null)[]>([])

  const isVerifying  = verifyEmailState.status === 'loading'
  const isSuccess    = verifyEmailState.status === 'success'
  const isVerifyError = verifyEmailState.status === 'error'
  const isSending    = senderStore.state.status === 'sending'
  const isSendError  = senderStore.state.status === 'error'
  const hasActiveCode = senderStore.state.status === 'codeSent'
  const neverSent    = senderStore.state.status === 'idle'
  const isExpired    = senderStore.secondsRemaining === 0 && senderStore.state.status === 'codeSent'
  const canResend    = isExpired && senderStore.resendCooldown === 0
  const inputsDisabled = isVerifying || isSuccess || isSending

  const allFilled    = digits.every(d => d.length === 1)

  // Reset digits when a new code is sent (resend)
  useEffect(() => {
    if (senderStore.state.status === 'codeSent') {
      setDigits(Array(CODE_LENGTH).fill(''))
      inputRefs.current[0]?.focus()
    }
  }, [senderStore.state.status])

  // ── OTP handlers ─────────────────────────────────────────────────────────

  const handleChange = useCallback((index: number, value: string) => {
    // Only accept single digit
    const digit = value.replace(/\D/g, '').slice(-1)
    const next  = [...digits]
    next[index] = digit
    setDigits(next)

    // Auto-advance focus
    if (digit && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }, [digits])

  const handleKeyDown = useCallback((index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }, [digits])

  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, CODE_LENGTH)
    if (!pasted) return
    const next = Array(CODE_LENGTH).fill('')
    pasted.split('').forEach((char, i) => { next[i] = char })
    setDigits(next)
    // Focus last filled or last box
    const lastIndex = Math.min(pasted.length - 1, CODE_LENGTH - 1)
    inputRefs.current[lastIndex]?.focus()
  }, [])

  // ── Verify handler ────────────────────────────────────────────────────────

  const handleVerify = () => {
    if (!allFilled || isVerifying || isSuccess) return
    verifyCode(digits.join(''))
  }

  // ── OTP input class ───────────────────────────────────────────────────────

  const otpInputClass = (index: number) => {
    let cls = 'verify-email-otp-input'
    if (isSuccess)    cls += ' is-success'
    else if (isVerifyError && digits[index]) cls += ' is-error'
    return cls
  }

  // ── Icon ─────────────────────────────────────────────────────────────────

  const iconName     = isSuccess ? 'verified' : 'mail'
  const iconCircleCls = `verify-email-icon-circle${isSuccess ? ' is-success' : ''}`

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="verify-email-page">

      {/* Back link */}
      <Link to="/account" className="verify-email-back-link">
        <span className="material-symbols-outlined material-icon">arrow_back</span>
        <span>{t('verifyEmail.backToSettings')}</span>
      </Link>

      <main className="verify-email-main">

        {/* Step indicator */}
        <span className="verify-email-step">
          {t('verifyEmail.stepIndicator')}
        </span>

        {/* Icon with ripple */}
        <div className="verify-email-icon-wrap">
          <div className="verify-email-icon-ripple" aria-hidden="true" />
          <div className={iconCircleCls}>
            <span className="material-symbols-outlined" aria-hidden="true">
              {iconName}
            </span>
          </div>
        </div>

        {/* Title & subtitle */}
        <h1 className="verify-email-title">{t('verifyEmail.title')}</h1>
        <p className="verify-email-subtitle">
          {t('verifyEmail.subtitle')}{' '}
          <span className="verify-email-subtitle-email">
            {session?.email ?? ''}
          </span>
        </p>

        {/* Send error banner */}
        {isSendError && senderStore.state.status === 'error' && (
          <div className="verify-email-send-error" role="alert" aria-live="polite">
            <span className="material-symbols-outlined material-icon" aria-hidden="true">error</span>
            <span>{senderStore.state.message}</span>
          </div>
        )}

        {/* No active code — idle, sending, or send error */}
        {!hasActiveCode && (
          <div className="verify-email-no-code">
            {neverSent && (
              <p className="verify-email-no-code-text">{t('verifyEmail.noCode.idle')}</p>
            )}
            {isSending && (
              <p className="verify-email-no-code-text">{t('verifyEmail.noCode.sending')}</p>
            )}
          </div>
        )}

        {/* OTP inputs */}
        {hasActiveCode && (
          <>
            <div className="verify-email-otp-row" role="group" aria-label="Verification code">
              {digits.map((digit, i) => (
                <input
                  key={i}
                  ref={el => { inputRefs.current[i] = el }}
                  className={otpInputClass(i)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  disabled={inputsDisabled}
                  autoComplete={i === 0 ? 'one-time-code' : 'off'}
                  aria-label={`Digit ${i + 1}`}
                  onChange={e => handleChange(i, e.target.value)}
                  onKeyDown={e => handleKeyDown(i, e)}
                  onPaste={i === 0 ? handlePaste : undefined}
                />
              ))}
            </div>

            {/* Verify error feedback */}
            {isVerifyError && (
              <div className="verify-email-feedback is-error" role="alert" aria-live="polite">
                <span className="material-symbols-outlined material-icon" aria-hidden="true">error</span>
                <span>{verifyEmailState.message}</span>
              </div>
            )}

            {/* Success feedback */}
            {isSuccess && (
              <div className="verify-email-feedback is-success" role="status" aria-live="polite">
                <span className="material-symbols-outlined material-icon" aria-hidden="true">check_circle</span>
                <span>{t('verifyEmail.feedback.success')}</span>
              </div>
            )}

            {/* Timer */}
            <div className="verify-email-timer" aria-live="polite">
              <span className="material-symbols-outlined material-icon" aria-hidden="true">schedule</span>
              {isExpired
                ? <span className={getTimerClass(0)}>{t('verifyEmail.timer.expired')}</span>
                : (
                  <span>
                    {t('verifyEmail.timer.expiresIn')}{' '}
                    <span className={getTimerClass(senderStore.secondsRemaining)}>
                      {formatSeconds(senderStore.secondsRemaining)}
                    </span>
                  </span>
                )
              }
            </div>

            {/* Verify button */}
            <button
              className={`verify-email-btn${isSuccess ? ' is-success' : ''}`}
              disabled={!allFilled || isVerifying || isSuccess || inputsDisabled}
              onClick={handleVerify}
              type="button"
            >
              {isVerifying
                ? <><div className="verify-email-spinner" aria-hidden="true" /><span>{t('verifyEmail.actions.verifying')}</span></>
                : <span>{isSuccess ? t('verifyEmail.feedback.success') : t('verifyEmail.actions.verify')}</span>
              }
            </button>
          </>
        )}

        {/* Resend section */}
        <div className="verify-email-resend">
          <span>{t('verifyEmail.actions.didNotReceive')}</span>
          <button
            className="verify-email-resend-btn"
            disabled={isSending || (!neverSent && !canResend)}
            onClick={() => senderStore.sendCode()}
            type="button"
          >
            {isSending
              ? <span>{t('verifyEmail.actions.verifying')}</span>
              : neverSent
                ? <span>{t('verifyEmail.actions.sendCode')}</span>
                : canResend
                  ? <span>{t('verifyEmail.actions.resend')}</span>
                  : <span>{t('verifyEmail.actions.resendIn')} {senderStore.resendCooldown}s</span>
            }
          </button>
        </div>

      </main>
    </div>
  )
}
