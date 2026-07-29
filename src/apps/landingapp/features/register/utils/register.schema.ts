// register.schema.ts — Yup validation schema for the registration form
// Built inside a function so t() is called at runtime, making error
// messages fully reactive to language changes via i18next.

import * as Yup from 'yup'
import type { TFunction } from 'i18next'

export function buildRegisterSchema(t: TFunction<'auth'>) {
  return Yup.object({
    firstName: Yup.string()
      .trim()
      .required(t('register.errors.firstNameRequired')),

    lastName: Yup.string()
      .trim()
      .required(t('register.errors.lastNameRequired')),

    companyName: Yup.string()
      .trim()
      .required(t('register.errors.companyNameRequired')),

    email: Yup.string()
      .trim()
      .required(t('register.errors.emailRequired'))
      .email(t('register.errors.emailInvalid')),

    password: Yup.string()
      .required(t('register.errors.passwordRequired'))
      .matches(
        /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
        t('register.errors.passwordStrength')
      ),

    confirmPassword: Yup.string()
      .required(t('register.errors.confirmPasswordRequired'))
      .oneOf([Yup.ref('password')], t('register.errors.passwordMismatch')),

    acceptTerms: Yup.boolean()
      .oneOf([true], t('register.errors.termsRequired')),
  })
}

export type RegisterSchema = ReturnType<typeof buildRegisterSchema>
