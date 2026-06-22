// profile.schema.ts — Yup validation schema for the Profile edit form
//
// Mirrors EditTenantProfileCommandValidator field-for-field, including the
// exact regex patterns used by the backend's CustomValidators (PersonName,
// CompanyName, InternationalPhone) so client and server reject the same
// inputs. Built inside a function so t() is called at runtime, making error
// messages fully reactive to language changes via i18next — same pattern
// as register.schema.ts.

import * as Yup from 'yup'
import type { TFunction } from 'i18next'

// Mirrors DreamSoft.Application.Common.Validators.CustomValidators exactly
const PERSON_NAME_REGEX  = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\-']+$/
const COMPANY_NAME_REGEX = /^[a-zA-Z0-9\s\-.,&]+$/
const PHONE_REGEX        = /^\+?[1-9]\d{1,14}$/ // E.164

export function buildProfileSchema(t: TFunction<'profile'>) {
  return Yup.object({
    firstName: Yup.string()
      .trim()
      .required(t('edit.errors.firstNameRequired'))
      .min(2, t('edit.errors.firstNameLength'))
      .max(100, t('edit.errors.firstNameLength'))
      .matches(PERSON_NAME_REGEX, t('edit.errors.firstNameInvalid')),

    lastName: Yup.string()
      .trim()
      .required(t('edit.errors.lastNameRequired'))
      .min(2, t('edit.errors.lastNameLength'))
      .max(100, t('edit.errors.lastNameLength'))
      .matches(PERSON_NAME_REGEX, t('edit.errors.lastNameInvalid')),

    companyName: Yup.string()
      .trim()
      .required(t('edit.errors.companyNameRequired'))
      .min(2, t('edit.errors.companyNameLength'))
      .max(255, t('edit.errors.companyNameLength'))
      .matches(COMPANY_NAME_REGEX, t('edit.errors.companyNameInvalid')),

    phone: Yup.string()
      .trim()
      .required(t('edit.errors.phoneRequired'))
      .matches(PHONE_REGEX, t('edit.errors.phoneInvalid')),

    website: Yup.string()
      .trim()
      .max(255, t('edit.errors.websiteLength'))
      .notRequired(),

    addressLine1: Yup.string()
      .trim()
      .required(t('edit.errors.addressLine1Required'))
      .max(255, t('edit.errors.addressLine1Length')),

    addressLine2: Yup.string()
      .trim()
      .max(255, t('edit.errors.addressLine2Length'))
      .notRequired(),

    countryId: Yup.number()
      .nullable()
      .required(t('edit.errors.countryRequired'))
      .positive(t('edit.errors.countryRequired')),

    provinceId: Yup.number()
      .nullable()
      .required(t('edit.errors.provinceRequired'))
      .positive(t('edit.errors.provinceRequired')),

    municipalityId: Yup.number()
      .nullable()
      .required(t('edit.errors.municipalityRequired'))
      .positive(t('edit.errors.municipalityRequired')),

    postalCode: Yup.string()
      .trim()
      .max(20, t('edit.errors.postalCodeLength'))
      .notRequired(),

    languageId: Yup.number()
      .nullable()
      .required(t('edit.errors.languageRequired'))
      .positive(t('edit.errors.languageRequired')),
  })
}

export type ProfileSchema = ReturnType<typeof buildProfileSchema>
