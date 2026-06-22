// register.types.ts — All types for the registration feature

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

export interface RegisterResponse {
  accessToken:         string
  expiresAt:           string
  tenantId:            number
  email:               string
  firstName:           string
  lastName:            string
  logoUrl:             string
  tenantStatusCode:    string
  emailVerified:       boolean
  onboardingCompleted: boolean
}

// ── Form types (inferred from Yup schema) ────────────────────────────────────

export type FormValues = InferType<ReturnType<typeof buildRegisterSchema>>
