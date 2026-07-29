// ProfileEditPage — Edit form for the tenant's profile
//
// Mirrors RegisterPage's Formik pattern (innerRef + setErrors on backend
// validation failure) using the same PrimeReact controls. Gated by
// prefillState (whole-page loading/error) from useProfileEdit; Country
// has its own independent loading/error/retry via countriesState, and
// Province/Municipality cascade from their parent selection, disabled
// until the parent is chosen.

import { useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  Formik,
  Form,
  Field,
  type FieldProps,
  type FormikProps,
} from "formik";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { useProfileEdit } from "../hooks/useProfileEdit";
import { buildProfileSchema } from "../utils/profile.schema";
import { useLanguageStore } from "@/shared/store/language.store";
import type { FormValues } from "../types/profile.types";
import "../styles/profile-edit.css";

export function ProfileEditPage() {
  const { t } = useTranslation("profile");
  const schema = useMemo(() => buildProfileSchema(t), [t]);
  const formikRef = useRef<FormikProps<FormValues>>(null);
  const languages = useLanguageStore((s) => s.languages);

  const {
    prefillState,
    retryPrefill,
    countriesState,
    retryCountries,
    provincesState,
    municipalitiesState,
    onCountryChange,
    onProvinceChange,
    profileEditState,
    submit,
    cancel,
  } = useProfileEdit();

  // Apply backend field-level validation errors into Formik
  useEffect(() => {
    if (profileEditState.status === "error" && profileEditState.fieldErrors) {
      formikRef.current?.setErrors(profileEditState.fieldErrors);
    }
  }, [profileEditState]);

  // ── Whole-page gate — no data to build the form yet ───────────────────────

  if (prefillState.status === "idle" || prefillState.status === "loading") {
    return (
      <div className="tcp-profile-edit-loading">
        <div className="tcp-profile-edit-spinner" role="status" />
        <p>{t("view.loading")}</p>
      </div>
    );
  }

  if (prefillState.status === "error") {
    return (
      <div className="tcp-profile-edit-error">
        <span
          className="material-symbols-outlined"
          style={{ fontSize: 40, color: "var(--color-error-500)" }}
        >
          error
        </span>
        <p className="tcp-profile-edit-error__title">{t("view.errorTitle")}</p>
        <p>{prefillState.message || t("view.errorMessage")}</p>
        <button type="button" className="tcp-profile-edit-save-btn" onClick={retryPrefill}>
          {t("view.retry")}
        </button>
      </div>
    );
  }

  const initialValues = prefillState.data;

  const countryOptions = countriesState.status === "success" ? countriesState.data : [];
  const provinceOptions = provincesState.status === "success" ? provincesState.data : [];
  const municipalityOptions =
    municipalitiesState.status === "success" ? municipalitiesState.data : [];

  return (
    <div className="tcp-profile-edit-page">
      {/* Page Header */}
      <div className="tcp-profile-edit-header">
        <button type="button" className="tcp-profile-edit-back-link" onClick={cancel}>
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
            arrow_back
          </span>
          {t("edit.backToProfile")}
        </button>
        <h2 className="tcp-profile-edit-title">{t("edit.title")}</h2>
      </div>

      {/* Form Card */}
      <div className="tcp-profile-edit-card">
        <Formik
          innerRef={formikRef}
          initialValues={initialValues}
          validationSchema={schema}
          enableReinitialize
          onSubmit={submit}
        >
          {({ values, errors, touched, setFieldValue }) => (
            <Form noValidate className="tcp-profile-edit-form">
              {/* Section 1: Personal Information */}
              <section>
                <div className="tcp-profile-edit-section-header">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                    person
                  </span>
                  <h3 className="tcp-profile-edit-section-title">{t("edit.sections.personal")}</h3>
                </div>
                <div className="tcp-profile-edit-section-body">
                  <div className="tcp-profile-edit-field">
                    <label className="tcp-profile-edit-label" htmlFor="firstName">
                      {t("edit.fields.firstName")}
                    </label>
                    <Field name="firstName">
                      {({ field }: FieldProps) => (
                        <InputText
                          {...field}
                          id="firstName"
                          autoComplete="given-name"
                          placeholder={t("edit.fields.firstNamePlaceholder")}
                          disabled={profileEditState.status === "loading"}
                          className={touched.firstName && errors.firstName ? "p-invalid" : ""}
                        />
                      )}
                    </Field>
                    {touched.firstName && errors.firstName && (
                      <small className="tcp-profile-edit-error-msg">{errors.firstName}</small>
                    )}
                  </div>

                  <div className="tcp-profile-edit-field">
                    <label className="tcp-profile-edit-label" htmlFor="lastName">
                      {t("edit.fields.lastName")}
                    </label>
                    <Field name="lastName">
                      {({ field }: FieldProps) => (
                        <InputText
                          {...field}
                          id="lastName"
                          autoComplete="family-name"
                          placeholder={t("edit.fields.lastNamePlaceholder")}
                          disabled={profileEditState.status === "loading"}
                          className={touched.lastName && errors.lastName ? "p-invalid" : ""}
                        />
                      )}
                    </Field>
                    {touched.lastName && errors.lastName && (
                      <small className="tcp-profile-edit-error-msg">{errors.lastName}</small>
                    )}
                  </div>
                </div>
              </section>

              <div className="tcp-profile-edit-divider" />

              {/* Section 2: Company Information */}
              <section>
                <div className="tcp-profile-edit-section-header">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                    corporate_fare
                  </span>
                  <h3 className="tcp-profile-edit-section-title">{t("edit.sections.company")}</h3>
                </div>
                <div className="tcp-profile-edit-section-body">
                  <div className="tcp-profile-edit-field">
                    <label className="tcp-profile-edit-label" htmlFor="companyName">
                      {t("edit.fields.companyName")}
                    </label>
                    <Field name="companyName">
                      {({ field }: FieldProps) => (
                        <InputText
                          {...field}
                          id="companyName"
                          autoComplete="organization"
                          placeholder={t("edit.fields.companyNamePlaceholder")}
                          disabled={profileEditState.status === "loading"}
                          className={touched.companyName && errors.companyName ? "p-invalid" : ""}
                        />
                      )}
                    </Field>
                    {touched.companyName && errors.companyName && (
                      <small className="tcp-profile-edit-error-msg">{errors.companyName}</small>
                    )}
                  </div>

                  <div className="tcp-profile-edit-field">
                    <label className="tcp-profile-edit-label" htmlFor="phone">
                      {t("edit.fields.phone")}
                    </label>
                    <Field name="phone">
                      {({ field }: FieldProps) => (
                        <InputText
                          {...field}
                          id="phone"
                          type="tel"
                          autoComplete="tel"
                          placeholder={t("edit.fields.phonePlaceholder")}
                          disabled={profileEditState.status === "loading"}
                          className={touched.phone && errors.phone ? "p-invalid" : ""}
                        />
                      )}
                    </Field>
                    {touched.phone && errors.phone && (
                      <small className="tcp-profile-edit-error-msg">{errors.phone}</small>
                    )}
                  </div>

                  <div className="tcp-profile-edit-field">
                    <label className="tcp-profile-edit-label" htmlFor="website">
                      {t("edit.fields.website")}
                    </label>
                    <Field name="website">
                      {({ field }: FieldProps) => (
                        <InputText
                          {...field}
                          id="website"
                          type="url"
                          placeholder={t("edit.fields.websitePlaceholder")}
                          disabled={profileEditState.status === "loading"}
                          className={touched.website && errors.website ? "p-invalid" : ""}
                        />
                      )}
                    </Field>
                    {touched.website && errors.website && (
                      <small className="tcp-profile-edit-error-msg">{errors.website}</small>
                    )}
                  </div>
                </div>
              </section>

              <div className="tcp-profile-edit-divider" />

              {/* Section 3: Address */}
              <section>
                <div className="tcp-profile-edit-section-header">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                    map
                  </span>
                  <h3 className="tcp-profile-edit-section-title">{t("edit.sections.address")}</h3>
                </div>
                <div className="tcp-profile-edit-section-body">
                  <div className="tcp-profile-edit-field">
                    <label className="tcp-profile-edit-label" htmlFor="addressLine1">
                      {t("edit.fields.addressLine1")}
                    </label>
                    <Field name="addressLine1">
                      {({ field }: FieldProps) => (
                        <InputText
                          {...field}
                          id="addressLine1"
                          autoComplete="address-line1"
                          placeholder={t("edit.fields.addressLine1Placeholder")}
                          disabled={profileEditState.status === "loading"}
                          className={touched.addressLine1 && errors.addressLine1 ? "p-invalid" : ""}
                        />
                      )}
                    </Field>
                    {touched.addressLine1 && errors.addressLine1 && (
                      <small className="tcp-profile-edit-error-msg">{errors.addressLine1}</small>
                    )}
                  </div>

                  <div className="tcp-profile-edit-field">
                    <label className="tcp-profile-edit-label" htmlFor="addressLine2">
                      {t("edit.fields.addressLine2")}
                    </label>
                    <Field name="addressLine2">
                      {({ field }: FieldProps) => (
                        <InputText
                          {...field}
                          id="addressLine2"
                          autoComplete="address-line2"
                          placeholder={t("edit.fields.addressLine2Placeholder")}
                          disabled={profileEditState.status === "loading"}
                          className={touched.addressLine2 && errors.addressLine2 ? "p-invalid" : ""}
                        />
                      )}
                    </Field>
                    {touched.addressLine2 && errors.addressLine2 && (
                      <small className="tcp-profile-edit-error-msg">{errors.addressLine2}</small>
                    )}
                  </div>

                  {/* Country — has its own independent loading/error state */}
                  <div className="tcp-profile-edit-field">
                    <label className="tcp-profile-edit-label" htmlFor="countryId">
                      {t("edit.fields.country")}
                    </label>
                    <div className="tcp-profile-edit-field-with-status">
                      <Field name="countryId">
                        {({ field }: FieldProps) => (
                          <Dropdown
                            inputId="countryId"
                            value={field.value}
                            options={countryOptions}
                            optionLabel="name"
                            optionValue="countryId"
                            placeholder={t("edit.fields.countryPlaceholder")}
                            filter
                            disabled={
                              profileEditState.status === "loading" ||
                              countriesState.status === "loading"
                            }
                            className={touched.countryId && errors.countryId ? "p-invalid" : ""}
                            onChange={(e) => {
                              setFieldValue("countryId", e.value);
                              setFieldValue("provinceId", null);
                              setFieldValue("municipalityId", null);
                              onCountryChange(e.value);
                            }}
                          />
                        )}
                      </Field>
                      {countriesState.status === "loading" && (
                        <div className="tcp-profile-edit-inline-spinner" role="status" />
                      )}
                      {countriesState.status === "error" && (
                        <button
                          type="button"
                          className="tcp-profile-edit-retry-btn"
                          onClick={retryCountries}
                        >
                          {t("view.retry")}
                        </button>
                      )}
                    </div>
                    {countriesState.status === "error" && (
                      <small className="tcp-profile-edit-error-msg">{countriesState.message}</small>
                    )}
                    {touched.countryId && errors.countryId && (
                      <small className="tcp-profile-edit-error-msg">{errors.countryId}</small>
                    )}
                  </div>

                  {/* Province — locked until a Country is selected */}
                  <div className="tcp-profile-edit-field">
                    <label className="tcp-profile-edit-label" htmlFor="provinceId">
                      {t("edit.fields.province")}
                    </label>
                    <div className="tcp-profile-edit-field-with-status">
                      <Field name="provinceId">
                        {({ field }: FieldProps) => (
                          <Dropdown
                            inputId="provinceId"
                            value={field.value}
                            options={provinceOptions}
                            optionLabel="name"
                            optionValue="provinceId"
                            placeholder={t("edit.fields.provincePlaceholder")}
                            filter
                            disabled={
                              profileEditState.status === "loading" ||
                              !values.countryId ||
                              provincesState.status === "loading"
                            }
                            className={touched.provinceId && errors.provinceId ? "p-invalid" : ""}
                            onChange={(e) => {
                              setFieldValue("provinceId", e.value);
                              setFieldValue("municipalityId", null);
                              onProvinceChange(e.value);
                            }}
                          />
                        )}
                      </Field>
                      {provincesState.status === "loading" && (
                        <div className="tcp-profile-edit-inline-spinner" role="status" />
                      )}
                    </div>
                    {!values.countryId && (
                      <span className="tcp-profile-edit-hint">
                        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                          lock
                        </span>
                        {t("edit.fields.provinceLockedHint")}
                      </span>
                    )}
                    {provincesState.status === "error" && (
                      <small className="tcp-profile-edit-error-msg">{provincesState.message}</small>
                    )}
                    {touched.provinceId && errors.provinceId && (
                      <small className="tcp-profile-edit-error-msg">{errors.provinceId}</small>
                    )}
                  </div>

                  {/* Municipality — locked until a Province is selected */}
                  <div className="tcp-profile-edit-field">
                    <label className="tcp-profile-edit-label" htmlFor="municipalityId">
                      {t("edit.fields.municipality")}
                    </label>
                    <div className="tcp-profile-edit-field-with-status">
                      <Field name="municipalityId">
                        {({ field }: FieldProps) => (
                          <Dropdown
                            inputId="municipalityId"
                            value={field.value}
                            options={municipalityOptions}
                            optionLabel="name"
                            optionValue="municipalityId"
                            placeholder={t("edit.fields.municipalityPlaceholder")}
                            filter
                            disabled={
                              profileEditState.status === "loading" ||
                              !values.provinceId ||
                              municipalitiesState.status === "loading"
                            }
                            className={touched.municipalityId && errors.municipalityId ? "p-invalid" : ""}
                            onChange={(e) => setFieldValue("municipalityId", e.value)}
                          />
                        )}
                      </Field>
                      {municipalitiesState.status === "loading" && (
                        <div className="tcp-profile-edit-inline-spinner" role="status" />
                      )}
                    </div>
                    {!values.provinceId && (
                      <span className="tcp-profile-edit-hint">
                        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                          lock
                        </span>
                        {t("edit.fields.municipalityLockedHint")}
                      </span>
                    )}
                    {municipalitiesState.status === "error" && (
                      <small className="tcp-profile-edit-error-msg">{municipalitiesState.message}</small>
                    )}
                    {touched.municipalityId && errors.municipalityId && (
                      <small className="tcp-profile-edit-error-msg">{errors.municipalityId}</small>
                    )}
                  </div>

                  <div className="tcp-profile-edit-field">
                    <label className="tcp-profile-edit-label" htmlFor="postalCode">
                      {t("edit.fields.postalCode")}
                    </label>
                    <Field name="postalCode">
                      {({ field }: FieldProps) => (
                        <InputText
                          {...field}
                          id="postalCode"
                          autoComplete="postal-code"
                          placeholder={t("edit.fields.postalCodePlaceholder")}
                          disabled={profileEditState.status === "loading"}
                          className={touched.postalCode && errors.postalCode ? "p-invalid" : ""}
                        />
                      )}
                    </Field>
                    {touched.postalCode && errors.postalCode && (
                      <small className="tcp-profile-edit-error-msg">{errors.postalCode}</small>
                    )}
                  </div>
                </div>
              </section>

              <div className="tcp-profile-edit-divider" />

              {/* Section 4: Preferences */}
              <section>
                <div className="tcp-profile-edit-section-header">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                    settings_suggest
                  </span>
                  <h3 className="tcp-profile-edit-section-title">{t("edit.sections.preferences")}</h3>
                </div>
                <div className="tcp-profile-edit-section-body">
                  <div className="tcp-profile-edit-field">
                    <label className="tcp-profile-edit-label" htmlFor="languageId">
                      {t("edit.fields.language")}
                    </label>
                    <Field name="languageId">
                      {({ field }: FieldProps) => (
                        <Dropdown
                          inputId="languageId"
                          value={field.value}
                          options={languages}
                          optionLabel="name"
                          optionValue="id"
                          placeholder={t("edit.fields.languagePlaceholder")}
                          disabled={profileEditState.status === "loading"}
                          className={touched.languageId && errors.languageId ? "p-invalid" : ""}
                          onChange={(e) => setFieldValue("languageId", e.value)}
                        />
                      )}
                    </Field>
                    {touched.languageId && errors.languageId && (
                      <small className="tcp-profile-edit-error-msg">{errors.languageId}</small>
                    )}
                  </div>
                </div>
              </section>

              {/* API error banner */}
              <div aria-live="polite" aria-atomic="true">
                {profileEditState.status === "error" && (
                  <div className="tcp-profile-edit-api-error">
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                      error
                    </span>
                    {profileEditState.message}
                  </div>
                )}
              </div>

              {/* Action Bar */}
              <div className="tcp-profile-edit-actions">
                <button
                  type="button"
                  className="tcp-profile-edit-cancel-btn"
                  onClick={cancel}
                  disabled={profileEditState.status === "loading"}
                >
                  {t("edit.cancel")}
                </button>
                <button
                  type="submit"
                  className="tcp-profile-edit-save-btn"
                  disabled={profileEditState.status === "loading"}
                >
                  <span
                    className={`material-symbols-outlined ${
                      profileEditState.status === "loading" ? "tcp-profile-edit-spin-icon" : ""
                    }`}
                    style={{ fontSize: 18 }}
                  >
                    {profileEditState.status === "loading" ? "sync" : "check"}
                  </span>
                  {profileEditState.status === "loading" ? t("edit.saving") : t("edit.save")}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
