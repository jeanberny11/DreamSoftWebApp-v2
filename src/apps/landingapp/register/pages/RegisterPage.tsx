// RegisterPage — tenant self-registration
// One-column card layout, PrimeReact + Formik + Yup

import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Formik,
  Form,
  Field,
  type FieldProps,
  type FormikHelpers,
} from "formik";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Checkbox } from "primereact/checkbox";
import { useRegister } from "../hooks/useRegister";
import { buildRegisterSchema } from "../utils/register.schema";
import type { FormValues } from "../types/register.types";
import { LanguageSwitcher } from "@/shared/components/LanguageSwitcher";
import "../styles/register.css";

const TERMS_VERSION = "1.0";

const initialValues: FormValues = {
  firstName: "",
  lastName: "",
  companyName: "",
  email: "",
  password: "",
  confirmPassword: "",
  acceptTerms: false,
};

// ── Component ─────────────────────────────────────────────────────────────────

export function RegisterPage() {
  const { t } = useTranslation("auth");
  const { register, isLoading, error } = useRegister();

  // Schema rebuilt whenever the language changes — keeps validation messages
  // in sync with the currently active language
  const schema = useMemo(() => buildRegisterSchema(t), [t]);

  async function handleSubmit(
    values: FormValues,
    helpers: FormikHelpers<FormValues>,
  ) {
    const errors = await register({
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      companyName: values.companyName.trim(),
      email: values.email.trim(),
      password: values.password,
      termsVersion: TERMS_VERSION,
      acceptTerms: values.acceptTerms,
    });

    // If the API returned field-level validation errors, push them into Formik
    // so the exact field is highlighted — fieldErrors keys are already camelCase
    if (errors) {
      helpers.setErrors(errors);
    }
  }

  // ── Form ───────────────────────────────────────────────────────────────────

  return (
    <div className="reg-screen">
      {/* Language switcher — fixed top-right */}
      <div className="reg-lang-switcher">
        <LanguageSwitcher />
      </div>

      <div className="reg-card">
        {/* Logo */}
        <div className="reg-logo">
          <div className="reg-logo-badge">
            <span
              style={{ fontSize: "0.75rem", fontWeight: 700, color: "white" }}
            >
              DS
            </span>
          </div>
          <span className="reg-logo-text">DreamSoft</span>
        </div>

        {/* Header */}
        <h1 className="reg-title">{t("register.title")}</h1>
        <p className="reg-subtitle">{t("register.subtitle")}</p>

        <Formik
          initialValues={initialValues}
          validationSchema={schema}
          onSubmit={handleSubmit}
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
                        className={
                          touched.firstName && errors.firstName
                            ? "p-invalid"
                            : ""
                        }
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
                        className={
                          touched.lastName && errors.lastName ? "p-invalid" : ""
                        }
                      />
                    )}
                  </Field>
                  {touched.lastName && errors.lastName && (
                    <small className="reg-error-msg">{errors.lastName}</small>
                  )}
                </div>
              </div>

              {/* Company */}
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
                      className={
                        touched.companyName && errors.companyName
                          ? "p-invalid"
                          : ""
                      }
                    />
                  )}
                </Field>
                {touched.companyName && errors.companyName && (
                  <small className="reg-error-msg">{errors.companyName}</small>
                )}
              </div>

              {/* Email */}
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
                      className={
                        touched.email && errors.email ? "p-invalid" : ""
                      }
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
                      className={
                        touched.password && errors.password ? "p-invalid" : ""
                      }
                      onChange={(e) =>
                        form.setFieldValue("password", e.target.value)
                      }
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
                      className={
                        touched.confirmPassword && errors.confirmPassword
                          ? "p-invalid"
                          : ""
                      }
                      onChange={(e) =>
                        form.setFieldValue("confirmPassword", e.target.value)
                      }
                      onBlur={() =>
                        form.setFieldTouched("confirmPassword", true)
                      }
                      toggleMask
                      feedback={false}
                    />
                  )}
                </Field>
                {touched.confirmPassword && errors.confirmPassword && (
                  <small className="reg-error-msg">
                    {errors.confirmPassword}
                  </small>
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
                        onChange={(e) => {
                          form.setFieldValue("acceptTerms", !!e.checked);
                          form.setFieldTouched("acceptTerms", true);
                        }}
                      />
                    )}
                  </Field>
                  <label htmlFor="acceptTerms" className="reg-terms-text">
                    {t("register.terms")}{" "}
                    <a
                      href="/terms"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="reg-terms-link"
                    >
                      {t("register.termsOfService")}
                    </a>{" "}
                    {t("register.and")}{" "}
                    <a
                      href="/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="reg-terms-link"
                    >
                      {t("register.privacyPolicy")}
                    </a>
                  </label>
                </div>
                {touched.acceptTerms && errors.acceptTerms && (
                  <small className="reg-error-msg">{errors.acceptTerms}</small>
                )}
              </div>

              {/* API error banner — shown for all error kinds */}
              <div aria-live="polite" aria-atomic="true">
                {error && (
                  <div className="reg-api-error">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {error}
                  </div>
                )}
              </div>

              {/* Submit */}
              <button type="submit" disabled={isLoading} className="reg-submit">
                {isLoading ? t("register.submitting") : t("register.submit")}
              </button>
            </Form>
          )}
        </Formik>

        {/* Footer */}
        <p className="reg-footer">
          {t("register.alreadyHaveAccount")}{" "}
          <Link to="/login">{t("register.signIn")}</Link>
        </p>
      </div>
    </div>
  );
}
