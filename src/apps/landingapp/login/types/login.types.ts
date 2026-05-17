// login.types.ts — All types for the tenant login feature
//
// Aligned with the backend contracts:
//   Command  : LoginTenantCommand.cs
//   Response : LoginTenantClientResponse (TenantAuthController.cs)
//   Errors   : ForbiddenErrorCodes.cs  +  ErrorResponse.cs

// ── API ──────────────────────────────────────────────────────────────────────

/** Payload sent to POST /api/v1/tenant-auth/login */
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
  deviceInfo?: string; // optional — backend uses it for multi-device session tracking
}

/**
 * JSON body returned by the login endpoint on success.
 * NOTE: the refresh token is NOT included here — the backend sets it
 * as an HTTP-only, Secure, SameSite=Strict cookie automatically.
 */
export interface LoginResponse {
  accessToken: string;
  expiresAt: string; // ISO 8601 date string (DateTime serializes to string in JSON)
  tenantId: number;
  email: string;
  onboardingCompleted: boolean;
  emailVerified: boolean;
  tenantStatus: string;
}

// ── Form ─────────────────────────────────────────────────────────────────────

/**
 * Values managed by the login form.
 * deviceInfo is intentionally excluded — it is collected by the hook at
 * submit time (e.g. navigator.userAgent) and never entered by the user.
 */
export interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

// ── Forbidden error codes ─────────────────────────────────────────────────────

/**
 * Programmatic error codes the backend sends in the errorCode field of the
 * ErrorResponse body when a 403 Forbidden is returned during login.
 * Values mirror ForbiddenErrorCodes.cs in the Application layer.
 *
 * Only the codes that can actually be returned by LoginTenantCommandHandler
 * are included here:
 *   - ACCOUNT_LOCKED                   → valid credentials, account temporarily blocked
 *   - TENANT_PENDING_EMAIL_VERIFICATION → tenant hasn't verified their email yet
 *   - TENANT_SUSPENDED                  → account suspended by admin
 *   - TENANT_CANCELLED                  → account cancelled
 */
export const LOGIN_FORBIDDEN_CODES = {
  AccountLocked: "ACCOUNT_LOCKED",
  TenantPendingEmailVerification: "TENANT_PENDING_EMAIL_VERIFICATION",
  TenantSuspended: "TENANT_SUSPENDED",
  TenantCancelled: "TENANT_CANCELLED",
} as const;

export type LoginForbiddenCode =
  (typeof LOGIN_FORBIDDEN_CODES)[keyof typeof LOGIN_FORBIDDEN_CODES];
