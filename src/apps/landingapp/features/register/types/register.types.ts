// register.types.ts — All types for the registration feature
//
// Aligned with the backend contract:
//   Command  : RegisterTenantCommand.cs
//   Response : TenantAuthClientResponse (TenantAuthController.cs) — see
//              common/types/tenant-auth.types.ts for the shared response type

import type { InferType } from 'yup'
import type { buildRegisterSchema } from '../utils/register.schema'

// ── API types ────────────────────────────────────────────────────────────────

export interface RegisterRequest {
  firstName:    string
  lastName:     string
  companyName:  string
  email:        string
  password:     string
  termsVersion: string
  acceptTerms:  boolean | undefined
}

// NOTE: RegisterResponse used to be defined here. It has been consolidated
// into the shared TenantAuthResponse type in common/types/tenant-auth.types.ts,
// since Login, Refresh, and Register all return the exact same backend DTO
// (TenantAuthClientResponse).

// ── Form types (inferred from Yup schema) ────────────────────────────────────

export type FormValues = InferType<ReturnType<typeof buildRegisterSchema>>
