// login.schema.ts — Yup validation schema for the tenant login form
// Built inside a function so t() is called at runtime, making error
// messages fully reactive to language changes via i18next.
//
// Rules are intentionally kept simple and match the backend validator
// (LoginTenantCommandValidator.cs): required + max 255 chars per field.
// Password strength is NOT enforced here — that belongs to registration only.

import * as Yup from 'yup'
import type { TFunction } from 'i18next'

export function buildLoginSchema(t: TFunction<'auth'>) {
  return Yup.object({
    email: Yup.string()
      .trim()
      .required(t('login.errors.emailRequired'))
      .email(t('login.errors.emailInvalid'))
      .max(255, t('login.errors.emailInvalid')),

    password: Yup.string()
      .required(t('login.errors.passwordRequired'))
      .max(255, t('login.errors.passwordRequired')),

    rememberMe: Yup.boolean()
      .default(false),
  })
}

export type LoginSchema = ReturnType<typeof buildLoginSchema>
