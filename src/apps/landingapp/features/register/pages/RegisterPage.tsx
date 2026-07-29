// RegisterPage — tenant self-registration
// Switches on registerState.status — equivalent to BlocBuilder in flutter_bloc:
//   'initial' | 'error' → show form (error banner visible on error)
//   'loading'           → show form with all fields + button disabled
//   'success'           → show brief success indicator (navigation follows)

import { useEffect, useMemo, useRef } from "react";
import { Link }                       from "react-router-dom";
import { useTranslation }             from "react-i18next";
import {
  Formik,
  Form,
  Field,
  type FieldProps,
  type FormikProps,
} from "formik";
import { InputText } from "primereact/inputtext";
import { Password }  from "primereact/password";
import { Checkbox }  from "primereact/checkbox";
import { Button }    from "primereact/button";
import { useRegister }         from "../hooks/useRegister";
import { buildRegisterSchema } from "../utils/register.schema";
import type { FormValues }     from "../types/register.types";
import "../styles/register.css";

const initialValues: FormValues = {
  firstName:       "",
  lastName:        "",
  companyName:     "",
  email:           "",
  password:        "",
  confirmPassword: "",
  acceptTerms:     false,
};

// Matches Stitch register brand icon: circle-checkmark path
function BrandIcon() {
  return (
    <svg
      width="24" height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

export function RegisterPage() {
  const { t }                        = useTranslation("auth");
  const { registerState, register }  = useRegister();
  const schema                       = useMemo(() => buildRegisterSchema(t), [t]);
  const formikRef                    = useRef<FormikProps<FormValues>>(null);

  // Apply backend field-level validation errors into Formik
  useEffect(() => {
    if (registerState.status === "error" && registerState.fieldErrors) {
      formikRef.current?.setErrors(registerState.fieldErrors);
    }
  }, [registerState]);

  // ── Success — brief indicator before navigation ───────────────────────────
  if (registerState.status === "success") {
    return (
      <div className="reg-page">
        <div className="reg-container">
          <div className="reg-brand-row">
            <div className="reg-brand-icon"><BrandIcon /></div>
            <span className="reg-brand-name">DreamSoft</span>
          </div>
          <div className="reg-card">
            <div className="reg-success">
              <svg
                width="48" height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="9 12 11 14 15 10" />
              </svg>
              <p className="reg-success-title">{t("register.successTitle")}</p>
              <p className="reg-success-message">{t("register.successMessage")}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Initial | Loading | Error — form always visible ──────────────────────
  return (
    <div className="reg-page">
      <div className="reg-container">

        {/* Back to Home */}
        <Link to="/" className="reg-back-link">
          <i className="pi pi-chevron-left" aria-hidden="true" />
          <span>Back to Home</span>
        </Link>

        {/* Brand identity */}
        <div className="reg-brand-row">
          <div className="reg-brand-icon"><BrandIcon /></div>
          <span className="reg-brand-name">DreamSoft</span>
        </div>

        {/* Registration card */}
        <div className="reg-card">

          {/* Card header */}
          <div className="reg-card-header">
            <h1 className="reg-card-title">{t("register.title")}</h1>
            <p className="reg-card-subtitle">{t("register.subtitle")}</p>
          </div>

          <Formik
            innerRef={formikRef}
            initialValues={initialValues}
            validationSchema={schema}
            onSubmit={register}
          >
            {({ errors, touched }) => (
              <Form noValidate className="reg-form">

                {/* First + Last name */}
                <div className="reg-row">
                  <div className="reg-field">
                    <label className="reg-label" htmlFor="firstName">
                      {t("register.firstName")}
                    </label>
                    <Field name="firstName">
                      {({ field }: FieldProps) => (
                        <InputText
                          {...field}
                          id="firstName"
                          autoComplete="given-name"
                          placeholder={t("register.firstNamePlaceholder")}
                          disabled={registerState.status === "loading"}
                          className={touched.firstName && errors.firstName ? "p-invalid" : ""}
                        />
                      )}
                    </Field>
                    {touched.firstName && errors.firstName && (
                      <small className="reg-error-msg">{errors.firstName}</small>
                    )}
                  </div>

                  <div className="reg-field">
                    <label className="reg-label" htmlFor="lastName">
                      {t("register.lastName")}
                    </label>
                    <Field name="lastName">
                      {({ field }: FieldProps) => (
                        <InputText
                          {...field}
                          id="lastName"
                          autoComplete="family-name"
                          placeholder={t("register.lastNamePlaceholder")}
                          disabled={registerState.status === "loading"}
                          className={touched.lastName && errors.lastName ? "p-invalid" : ""}
                        />
                      )}
                    </Field>
                    {touched.lastName && errors.lastName && (
                      <small className="reg-error-msg">{errors.lastName}</small>
                    )}
                  </div>
                </div>

                {/* Company name */}
                <div className="reg-field">
                  <label className="reg-label" htmlFor="companyName">
                    {t("register.companyName")}
                  </label>
                  <Field name="companyName">
                    {({ field }: FieldProps) => (
                      <InputText
                        {...field}
                        id="companyName"
                        autoComplete="organization"
                        placeholder={t("register.companyNamePlaceholder")}
                        disabled={registerState.status === "loading"}
                        className={touched.companyName && errors.companyName ? "p-invalid" : ""}
                      />
                    )}
                  </Field>
                  {touched.companyName && errors.companyName && (
                    <small className="reg-error-msg">{errors.companyName}</small>
                  )}
                </div>

                {/* Work email */}
                <div className="reg-field">
                  <label className="reg-label" htmlFor="email">
                    {t("register.email")}
                  </label>
                  <Field name="email">
                    {({ field }: FieldProps) => (
                      <InputText
                        {...field}
                        id="email"
                        type="email"
                        placeholder={t("register.emailPlaceholder")}
                        spellCheck={false}
                        autoCorrect="off"
                        autoCapitalize="off"
                        disabled={registerState.status === "loading"}
                        className={touched.email && errors.email ? "p-invalid" : ""}
                      />
                    )}
                  </Field>
                  {touched.email && errors.email && (
                    <small className="reg-error-msg">{errors.email}</small>
                  )}
                </div>

                {/* Password */}
                <div className="reg-field">
                  <label className="reg-label" htmlFor="password">
                    {t("register.password")}
                  </label>
                  <Field name="password">
                    {({ field, form }: FieldProps) => (
                      <Password
                        {...field}
                        inputId="password"
                        placeholder={t("register.passwordPlaceholder")}
                        disabled={registerState.status === "loading"}
                        className={touched.password && errors.password ? "p-invalid" : ""}
                        onChange={(e) => form.setFieldValue("password", e.target.value)}
                        onBlur={() => form.setFieldTouched("password", true)}
                        toggleMask
                        feedback
                      />
                    )}
                  </Field>
                  {touched.password && errors.password && (
                    <small className="reg-error-msg">{errors.password}</small>
                  )}
                </div>

                {/* Confirm password */}
                <div className="reg-field">
                  <label className="reg-label" htmlFor="confirmPassword">
                    {t("register.confirmPassword")}
                  </label>
                  <Field name="confirmPassword">
                    {({ field, form }: FieldProps) => (
                      <Password
                        {...field}
                        inputId="confirmPassword"
                        placeholder={t("register.confirmPasswordPlaceholder")}
                        disabled={registerState.status === "loading"}
                        className={touched.confirmPassword && errors.confirmPassword ? "p-invalid" : ""}
                        onChange={(e) => form.setFieldValue("confirmPassword", e.target.value)}
                        onBlur={() => form.setFieldTouched("confirmPassword", true)}
                        toggleMask
                        feedback={false}
                      />
                    )}
                  </Field>
                  {touched.confirmPassword && errors.confirmPassword && (
                    <small className="reg-error-msg">{errors.confirmPassword}</small>
                  )}
                </div>

                {/* Terms */}
                <div>
                  <div className="reg-terms-row">
                    <Field name="acceptTerms">
                      {({ field, form }: FieldProps) => (
                        <Checkbox
                          inputId="acceptTerms"
                          checked={field.value}
                          disabled={registerState.status === "loading"}
                          onChange={(e) => {
                            form.setFieldValue("acceptTerms", !!e.checked);
                            form.setFieldTouched("acceptTerms", true);
                          }}
                        />
                      )}
                    </Field>
                    <label htmlFor="acceptTerms" className="reg-terms-text">
                      {t("register.terms")}{" "}
                      <a href="/terms" target="_blank" rel="noopener noreferrer" className="reg-terms-link">
                        {t("register.termsOfService")}
                      </a>{" "}
                      {t("register.and")}{" "}
                      <a href="/privacy" target="_blank" rel="noopener noreferrer" className="reg-terms-link">
                        {t("register.privacyPolicy")}
                      </a>
                    </label>
                  </div>
                  {touched.acceptTerms && errors.acceptTerms && (
                    <small className="reg-error-msg">{errors.acceptTerms}</small>
                  )}
                </div>

                {/* API error banner */}
                <div aria-live="polite" aria-atomic="true">
                  {registerState.status === "error" && (
                    <div className="reg-api-error">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round"
                        aria-hidden="true">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8"    x2="12"    y2="12" />
                        <line x1="12" y1="16"   x2="12.01" y2="16" />
                      </svg>
                      {registerState.message}
                    </div>
                  )}
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  label={registerState.status === "loading" ? t("register.submitting") : t("register.submit")}
                  loading={registerState.status === "loading"}
                  disabled={registerState.status === "loading"}
                  className="reg-submit"
                />

              </Form>
            )}
          </Formik>

          {/* Footer */}
          <div className="reg-footer">
            <p>
              {t("register.alreadyHaveAccount")}{" "}
              <Link to="/login">{t("register.signIn")}</Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
