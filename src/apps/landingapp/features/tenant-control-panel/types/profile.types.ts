// profile.types.ts — Types for the Tenant Profile feature (view + edit pages)

import type { InferType } from "yup";
import type { buildProfileSchema } from "../utils/profile.schema";

// ── GET /api/v1/landing/TenantProfile ───────────────────────────────────────
// Country/Province/Municipality now come back with their id included directly
// (countryId/provinceId/municipalityId), so the edit page can pre-fill the
// dropdowns immediately — no code-matching/resolution needed.

export interface ProfileResponse {
  id: number;
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
  phone: string;
  website: string;
  addressLine1: string;
  addressLine2: string;
  country: ProfileCountryDTO | null;
  province: ProfileProvinceDTO | null;
  municipality: ProfileMunicipalityDTO | null;
  postalCode: string;
  languageId: number;
  logoUrl: string;
  tenantStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileCountryDTO {
  countryId: number;
  code: string;
  name: string;
}

export interface ProfileProvinceDTO {
  provinceId: number;
  code: string;
  name: string;
}

export interface ProfileMunicipalityDTO {
  municipalityId: number;
  code: string;
  name: string;
}

// ── PUT /api/v1/landing/TenantProfile ───────────────────────────────────────
// Mirrors EditTenantProfileCommand exactly. Returns 204 No Content on success
// (no response body — see profile.service.ts and profile-edit.slice.ts).

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  companyName: string;
  phone: string;
  website: string | null;
  addressLine1: string;
  addressLine2: string | null;
  countryId: number;
  provinceId: number;
  municipalityId: number;
  postalCode: string | null;
  languageId: number;
}

// ── Form values — inferred from the Yup schema, same pattern as register.types.ts ──
//
// countryId/provinceId/municipalityId/languageId are overridden to
// `number | null` below. Yup's `.nullable().required()` combination allows
// `null` at runtime (a fresh form starts with nothing selected; `.required()`
// only rejects `null` during validation, on submit) — but InferType drops
// `null` from the inferred TS type once `.required()` is chained after
// `.nullable()`. Without this override, TypeScript would incorrectly assume
// these fields are always a real number, even before the user picks anything.
// The slice's non-null assertions on submit (values.countryId! etc.) remain
// valid — Yup's required() still blocks submission while any are null.

export type FormValues = Omit<
  InferType<ReturnType<typeof buildProfileSchema>>,
  "countryId" | "provinceId" | "municipalityId" | "languageId"
> & {
  countryId: number | null;
  provinceId: number | null;
  municipalityId: number | null;
  languageId: number | null;
};
