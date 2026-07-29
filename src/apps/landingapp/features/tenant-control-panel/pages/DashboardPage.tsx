import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useTenantAuthStore } from '@/apps/landingapp/common/tenant_auth.store'
import { useSendVerificationCodeStore } from '@/apps/landingapp/common/store/sendVerificationCode.store'
import { useOnboardingChecklistStore } from '../stores/onboarding-checklist.store'
import { OnboardingChecklist } from '../components/OnboardingChecklist'

export function DashboardPage() {
  const { t } = useTranslation('dashboard')
  const navigate = useNavigate()
  const firstName = useTenantAuthStore((s) => s.session?.firstName ?? '')
  const store = useOnboardingChecklistStore()
  const senderStore = useSendVerificationCodeStore()

  useEffect(() => {
    store.fetchChecklist()
  }, [])

  // Fire the send and navigate immediately — VerifyEmailPage reads
  // senderStore.state.status itself, so it handles sending/error/success.
  const handleVerifyEmail = () => {
    senderStore.sendCode()
    navigate('/verify-email')
  }

  return (
    <div className="tcp-dashboard">
      <section className="tcp-welcome">
        <div>
          <h2 className="tcp-welcome__title">
            {t('dashboard.welcome.title', { name: firstName })}
          </h2>
          <p className="tcp-welcome__subtitle">
            {t('dashboard.welcome.subtitle')}
          </p>
        </div>
      </section>

      {store.status === 'loading' && (
        <div className="oc-card">
          <div className="oc-skeleton__header">
            <div className="oc-skeleton__line oc-skeleton__line--title" />
            <div className="oc-skeleton__line oc-skeleton__line--subtitle" />
          </div>
          <div className="oc-list">
            {[0, 1, 2].map((i) => (
              <div key={i} className="oc-item oc-skeleton__item">
                <div className="oc-skeleton__icon" />
                <div className="oc-skeleton__content">
                  <div className="oc-skeleton__line oc-skeleton__line--sm" />
                  <div className="oc-skeleton__line oc-skeleton__line--xs" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {store.status === 'error' && (
        <div className="oc-card oc-error">
          <span className="material-symbols-outlined oc-error__icon">error_outline</span>
          <p className="oc-error__message">{store.message}</p>
          <button type="button" className="oc-error__retry" onClick={() => store.fetchChecklist()}>
            {t('onboardingChecklist.error.retry')}
          </button>
        </div>
      )}

      {store.status === 'success' && (
        <OnboardingChecklist
          emailVerified={store.data.verifications.emailVerified}
          profileCompleted={store.data.profileSetup.completed}
          activeSubscriptions={store.data.subscription.activeSubscriptions}
          onVerifyEmail={handleVerifyEmail}
          onSetupProfile={() => navigate('/account/profile/edit')}
          onEditProfile={() => navigate('/account/profile/edit')}
          onChoosePlan={() => navigate('/account/subscriptions/new')}
          onManagePlans={() => navigate('/account/subscriptions')}
        />
      )}
    </div>
  )
}
