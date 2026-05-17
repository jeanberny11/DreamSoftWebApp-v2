// LoginPage — tenant login
// Card layout matching RegisterPage, PrimeReact + Formik + Yup

import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Formik, Form, Field, type FieldProps } from 'formik'
import { InputText } from 'primereact/inputtext'
import { Password } from 'primereact/password'
import { Checkbox } from 'primereact/checkbox'
import { useLogin } from '../hooks/useLogin'
import { buildLoginSchema } from '../utils/login.schema'
import type { LoginFormValues } from '../types/login.types'
import { LanguageSwitcher } from '@/shared/components/LanguageSwitcher'
import '../styles/login.css'

const initialValues: LoginFormValues = {
  email:      '',
  password:   '',
  rememberMe: false,
}

export function LoginPage() {
  const { t }                       = useTranslation('auth')
  const { login, isLoading, error } = useLogin()

  // Schema rebuilt whenever the language changes — keeps validation messages
  // in sync with the currently active language
  const schema = useMemo(() => buildLoginSchema(t), [t])

  return (
    <div className="login-screen">

      <div className="login-lang-switcher">
        <LanguageSwitcher />
      </div>

      <div className="login-card">

        {/* Logo */}
        <div className="login-logo">
          <div className="login-logo-badge">
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'white' }}>DS</span>
          </div>
          <span className="login-logo-text">DreamSoft</span>
        </div>

        {/* Header */}
        <h1 className="login-title">{t('login.title')}</h1>
        <p className="login-subtitle">{t('login.subtitle')}</p>

        <Formik
          initialValues={initialValues}
          validationSchema={schema}
          onSubmit={login}
        >
          {({ errors, touched }) => (
            <Form noValidate className="login-form">

              {/* Email */}
              <div className="login-field">
                <label className="login-label" htmlFor="email">
                  {t('login.email')}
                </label>
                <Field name="email">
                  {({ field }: FieldProps) => (
                    <InputText
                      {...field}
                      id="email"
                      type="email"
                      autoComplete="email"
                      className={touched.email && errors.email ? 'p-invalid' : ''}
                    />
                  )}
                </Field>
                {touched.email && errors.email && (
                  <small className="login-error-msg">{errors.email}</small>
                )}
              </div>

              {/* Password */}
              <div className="login-field">
                <div className="login-password-header">
                  <label className="login-label" htmlFor="password">
                    {t('login.password')}
                  </label>
                  <Link to="/forgot-password" className="login-forgot-link">
                    {t('login.forgotPassword')}
                  </Link>
                </div>
                <Field name="password">
                  {({ field, form }: FieldProps) => (
                    <Password
                      {...field}
                      inputId="password"
                      autoComplete="current-password"
                      className={touched.password && errors.password ? 'p-invalid' : ''}
                      onChange={(e) => form.setFieldValue('password', e.target.value)}
                      onBlur={() => form.setFieldTouched('password', true)}
                      toggleMask
                      feedback={false}
                    />
                  )}
                </Field>
                {touched.password && errors.password && (
                  <small className="login-error-msg">{errors.password}</small>
                )}
              </div>

              {/* Remember me */}
              <div className="login-remember-row">
                <Field name="rememberMe">
                  {({ field, form }: FieldProps) => (
                    <Checkbox
                      inputId="rememberMe"
                      checked={field.value}
                      onChange={(e) => form.setFieldValue('rememberMe', !!e.checked)}
                    />
                  )}
                </Field>
                <label htmlFor="rememberMe" className="login-remember-label">
                  {t('login.rememberMe')}
                </label>
              </div>

              {/* API error banner */}
              {error && (
                <div className="login-api-error">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8"    x2="12"    y2="12" />
                    <line x1="12" y1="16"   x2="12.01" y2="16" />
                  </svg>
                  {error}
                </div>
              )}

              {/* Submit */}
              <button type="submit" disabled={isLoading} className="login-submit">
                {isLoading ? t('login.submitting') : t('login.submit')}
              </button>

            </Form>
          )}
        </Formik>

        {/* Footer */}
        <p className="login-footer">
          {t('login.noAccount')}{' '}
          <Link to="/register">{t('login.register')}</Link>
        </p>

      </div>
    </div>
  )
}
