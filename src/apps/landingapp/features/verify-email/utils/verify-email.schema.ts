import * as Yup           from 'yup'
import type { TFunction } from 'i18next'

export function buildVerifyEmailSchema(t: TFunction<'auth'>) {
  return Yup.object({
    // TODO: add field validations
    // code: Yup.string().required(t('verifyEmail.errors.codeRequired')),
  })
}

export type VerifyEmailSchema = ReturnType<typeof buildVerifyEmailSchema>
