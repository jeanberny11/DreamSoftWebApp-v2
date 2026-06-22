// sendVerificationCode.state.ts — Discriminated union state for the send verification code flow
//
// Mirrors the flutter_bloc pattern:
//   SendVerificationCodeIdle    → { status: 'idle' }
//   SendVerificationCodeSending → { status: 'sending' }
//   SendVerificationCodeSent    → { status: 'codeSent' }
//   SendVerificationCodeError   → { status: 'error', message }

export type SendVerificationCodeState =
  | { status: 'idle' }
  | { status: 'sending' }
  | { status: 'codeSent' }
  | { status: 'error'; message: string }
