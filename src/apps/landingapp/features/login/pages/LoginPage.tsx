// LoginPage.tsx — Tenant login
// Switches on loginState.status — equivalent to BlocBuilder in flutter_bloc:
//   'initial' | 'error' → show form (error banner visible on error)
//   'loading'           → show form with all fields + button disabled
//   'success'           → show brief success indicator (navigation follows)

import { useMemo }                         from 'react'
import { Link }                            from 'react-router-dom'
import { useTranslation }                  from 'react-i18next'
import { Formik, Form, Field,
         type FieldProps }                 from 'formik'
import { InputText }                       from 'primereact/inputtext'
import { Password }                        from 'primereact/password'
import { Checkbox }                        from 'primereact/checkbox'
import { Button }                          from 'primereact/button'
import { useLogin }                        from '../hooks/useLogin'
import { buildLoginSchema }                from '../utils/login.schema'
import type { LoginFormValues }            from '../types/login.types'
import '../styles/login.css'

const initialValues: LoginFormValues = {
  email:      '',
  password:   '',
  rememberMe: false,
}

// Matches Stitch: cloud_done Material Symbol (filled)
function CloudDoneIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="white" aria-hidden="true">
      <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM10 17l-3.5-3.5 1.41-1.41L10 14.17l4.18-4.18L15.59 11.4 10 17z"/>
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

function MicrosoftIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path d="M11.4 11.4H0V0h11.4v11.4z" fill="#F35325"/>
      <path d="M24 11.4H12.6V0H24v11.4z" fill="#81BC06"/>
      <path d="M11.4 24H0V12.6h11.4V24z" fill="#05A6F0"/>
      <path d="M24 24H12.6V12.6H24V24z" fill="#FFBA08"/>
    </svg>
  )
}

export function LoginPage() {
  const { t }                 = useTranslation('auth')
  const { loginState, login } = useLogin()

  const schema = useMemo(() => buildLoginSchema(t), [t])

  // ── Success state ────────────────────────────────────────────────────────
  if (loginState.status === 'success') {
    return (
      <div className="login-page">
        <div className="login-brand-row">
          <div className="login-brand-icon"><CloudDoneIcon /></div>
          <span className="login-brand-name">DreamSoft</span>
        </div>
        <div className="login-card">
          <div className="login-success">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"
              aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <polyline points="9 12 11 14 15 10" />
            </svg>
            <p>{t('login.success')}</p>
          </div>
        </div>
      </div>
    )
  }

  // ── Initial + Loading + Error states ────────────────────────────────────
  return (
    <div className="login-page">

      {/* Brand identity — Matches Stitch: flex flex-row items-center justify-center gap-3 mb-8 */}
      <div className="login-brand-row">
        <div className="login-brand-icon"><CloudDoneIcon /></div>
        <span className="login-brand-name">DreamSoft</span>
      </div>

      {/* Back to home link */}
      <div className="login-back-wrap">
        <Link to="/" className="login-back-link">
          <i className="pi pi-chevron-left" aria-hidden="true" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Login card */}
      <div className="login-card">

        {/* Card header — Matches Stitch: "Welcome Back" + subtitle */}
        <div className="login-card-header">
          <h2 className="login-card-title">Welcome Back</h2>
          <p className="login-card-subtitle">Enter your credentials to access your account</p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={schema}
          onSubmit={login}
        >
          {({ errors, touched }) => (
            <Form noValidate className="login-form">

              {/* Email — Matches Stitch: pl-10 with mail icon */}
              <div className="login-field">
                <label className="login-label" htmlFor="email">
                  {t('login.email')}
                </label>
                <div className="login-input-icon-wrapper">
                  <i className="pi pi-envelope login-input-icon" aria-hidden="true" />
                  <Field name="email">
                    {({ field }: FieldProps) => (
                      <InputText
                        {...field}
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder="name@company.com"
                        spellCheck={false}
                        autoCorrect="off"
                        autoCapitalize="off"
                        disabled={loginState.status === 'loading'}
                        className={touched.email && errors.email ? 'p-invalid' : ''}
                      />
                    )}
                  </Field>
                </div>
                {touched.email && errors.email && (
                  <small className="login-error-msg">{errors.email}</small>
                )}
              </div>

              {/* Password — Matches Stitch: lock icon left + visibility toggle right */}
              <div className="login-field">
                <div className="login-password-header">
                  <label className="login-label" htmlFor="password">
                    {t('login.password')}
                  </label>
                  <Link to="/forgot-password" className="login-forgot-link">
                    {t('login.forgotPassword')}
                  </Link>
                </div>
                <div className="login-input-icon-wrapper">
                  <i className="pi pi-lock login-input-icon" aria-hidden="true" />
                  <Field name="password">
                    {({ field, form }: FieldProps) => (
                      <Password
                        {...field}
                        inputId="password"
                        autoComplete="current-password"
                        placeholder="••••••••"
                        disabled={loginState.status === 'loading'}
                        className={touched.password && errors.password ? 'p-invalid' : ''}
                        onChange={(e) => form.setFieldValue('password', e.target.value)}
                        onBlur={() => form.setFieldTouched('password', true)}
                        toggleMask
                        feedback={false}
                      />
                    )}
                  </Field>
                </div>
                {touched.password && errors.password && (
                  <small className="login-error-msg">{errors.password}</small>
                )}
              </div>

              {/* Remember me — Matches Stitch: "Remember me for 30 days" */}
              <div className="login-remember-row">
                <Field name="rememberMe">
                  {({ field, form }: FieldProps) => (
                    <Checkbox
                      inputId="rememberMe"
                      checked={field.value}
                      disabled={loginState.status === 'loading'}
                      onChange={(e) => form.setFieldValue('rememberMe', !!e.checked)}
                    />
                  )}
                </Field>
                <label htmlFor="rememberMe" className="login-remember-label">
                  {t('login.rememberMe')}
                </label>
              </div>

              {/* API error banner */}
              <div aria-live="polite" aria-atomic="true">
                {loginState.status === 'error' && (
                  <div className="login-api-error">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round"
                      aria-hidden="true">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8"    x2="12"    y2="12" />
                      <line x1="12" y1="16"   x2="12.01" y2="16" />
                    </svg>
                    {loginState.message}
                  </div>
                )}
              </div>

              {/* Submit — Matches Stitch: w-full bg-primary-container py-3 rounded-lg shadow-sm active:scale-[0.98] */}
              <Button
                type="submit"
                label={loginState.status === 'loading' ? t('login.submitting') : t('login.submit')}
                loading={loginState.status === 'loading'}
                disabled={loginState.status === 'loading'}
                className="login-submit"
              />

            </Form>
          )}
        </Formik>

        {/* Divider — Matches Stitch: "Or continue with" */}
        <div className="login-divider">
          <div className="login-divider-line" />
          <span className="login-divider-text">Or continue with</span>
          <div className="login-divider-line" />
        </div>

        {/* Social login — Matches Stitch: grid grid-cols-2 gap-4 */}
        <div className="login-social-grid">
          <button className="login-social-btn" type="button">
            <GoogleIcon />
            <span>Google</span>
          </button>
          <button className="login-social-btn" type="button">
            <MicrosoftIcon />
            <span>Microsoft</span>
          </button>
        </div>

        {/* Footer link */}
        <p className="login-footer">
          {t('login.noAccount')}{' '}
          <Link to="/register">{t('login.register')}</Link>
        </p>

      </div>

      {/* Page footer — Matches Stitch: copyright + Privacy Policy + Terms + Contact */}
      <footer className="login-page-footer">
        <span>© {new Date().getFullYear()} DreamSoft Systems. All rights reserved.</span>
        <div className="login-page-footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Contact Support</a>
        </div>
      </footer>

    </div>
  )
}
