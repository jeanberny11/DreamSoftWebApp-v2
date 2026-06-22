// verify-email.types.ts — Shared types for the email verification feature
//
// Aligned with the backend contracts:
//   Command  : VerifyEmailCommand.cs
//   Response : VerifyEmailResponse.cs
//   Send     : SendEmailVerificationCodeCommand.cs (returns SendEmailVerificationCodeResponse)

/** JSON body returned by POST /api/v1/landing/SendEmailVerificationCode on success. */
export interface SendCodeResponse {
  email:     string;    // tenant email the code was sent to
  expiresAt: string;   // ISO 8601 UTC — used to calculate secondsRemaining
}

/** Payload sent to POST /api/v1/landing/VerifyEmail */
export interface VerifyCodeRequest {
  code: string;
}

/**
 * JSON body returned by the verify email endpoint on success.
 * Mirrors VerifyEmailResponse.cs in the Application layer.
 */
export interface VerifyCodeResponse {
  email:         string;
  emailVerified: boolean;
  statusCode:    string;
}
