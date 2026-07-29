// tenant-auth.types.ts — Shared response type for all tenant-auth endpoints
//
// Aligned with the backend contract:
//   Response : TenantAuthClientResponse (TenantAuthController.cs)
//   Used by  : Login, Refresh, and Register — all three endpoints now return
//              this exact same shape.

/**
 * JSON body returned by Login, Refresh, and Register on success.
 * NOTE: the refresh token is NOT included here — the backend sets it
 * as an HTTP-only, Secure, SameSite=Strict cookie automatically.
 */
export interface TenantAuthResponse {
  accessToken:         string;
  expiresAt:           string; // ISO 8601 date string (DateTime serializes to string in JSON)
  tenantId:            number;
  email:               string;
  firstName:           string;
  lastName:            string;
  logoUrl:             string;
  onboardingCompleted: boolean;
  emailVerified:       boolean;
  tenantStatusCode:    string;
}
