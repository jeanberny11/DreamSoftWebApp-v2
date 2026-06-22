import { useTranslation } from 'react-i18next'
import '../styles/onboarding-checklist.css'

interface OnboardingChecklistProps {
  emailVerified: boolean
  profileCompleted: boolean
  activeSubscriptions: number
  onVerifyEmail?: () => void
  onSetupProfile?: () => void
  onEditProfile?: () => void
  onChoosePlan?: () => void
  onManagePlans?: () => void
}

export function OnboardingChecklist({
  emailVerified,
  profileCompleted,
  activeSubscriptions,
  onVerifyEmail,
  onSetupProfile,
  onEditProfile,
  onChoosePlan,
  onManagePlans,
}: OnboardingChecklistProps) {
  const { t } = useTranslation('dashboard')

  const subscriptionDone = activeSubscriptions > 0
  const profileLocked = !emailVerified
  const subscriptionLocked = !profileCompleted
  const stepsRemaining = [!emailVerified, !profileCompleted, !subscriptionDone].filter(Boolean).length

  return (
    <div className="oc-card">

      <header className="oc-header">
        <div className="oc-header__left">
          <div className="oc-header__icon">
            <span className="material-symbols-outlined">assignment</span>
          </div>
          <div>
            <h1 className="oc-title">{t('onboardingChecklist.title')}</h1>
            <p className="oc-subtitle">{t('onboardingChecklist.subtitle')}</p>
          </div>
        </div>
        <div className="oc-status-badge">
          <span className="oc-status-badge__dot" />
          {stepsRemaining === 0
            ? t('onboardingChecklist.allCompleted')
            : t('onboardingChecklist.stepsRemaining', { count: stepsRemaining })}
        </div>
      </header>

      <div className="oc-grid">

        {/* Step 1 — Email */}
        <article className="oc-step">
          <div className="oc-step__top">
            <div className="oc-step__icon">
              <span className="material-symbols-outlined">mail</span>
            </div>
            <span className={`oc-badge oc-badge--${emailVerified ? 'success' : 'warning'}`}>
              {emailVerified
                ? t('onboardingChecklist.steps.email.statusDone')
                : t('onboardingChecklist.steps.email.statusPending')}
            </span>
          </div>
          <h3 className="oc-step__title">{t('onboardingChecklist.steps.email.title')}</h3>
          <p className="oc-step__desc">
            {emailVerified
              ? t('onboardingChecklist.steps.email.descriptionDone')
              : t('onboardingChecklist.steps.email.description')}
          </p>
          {emailVerified ? (
            <button className="oc-btn oc-btn--disabled" disabled>
              {t('onboardingChecklist.steps.email.statusDone')}
            </button>
          ) : (
            <button className="oc-btn oc-btn--ghost" onClick={onVerifyEmail}>
              {t('onboardingChecklist.steps.email.verifyAction')}
            </button>
          )}
        </article>

        {/* Step 2 — Profile */}
        <article className={`oc-step${profileLocked ? ' oc-step--locked' : ' oc-step--featured'}`}>
          <div className="oc-step__top">
            <div className="oc-step__icon">
              <span className="material-symbols-outlined">account_circle</span>
            </div>
            <span className={`oc-badge oc-badge--${profileLocked ? 'locked' : profileCompleted ? 'success' : 'warning'}`}>
              {profileLocked
                ? t('onboardingChecklist.steps.profile.statusLocked')
                : profileCompleted
                  ? t('onboardingChecklist.steps.profile.statusDone')
                  : t('onboardingChecklist.steps.profile.statusPending')}
            </span>
          </div>
          <h3 className="oc-step__title">{t('onboardingChecklist.steps.profile.title')}</h3>
          <p className="oc-step__desc">
            {profileLocked
              ? t('onboardingChecklist.steps.profile.descriptionLocked')
              : profileCompleted
                ? t('onboardingChecklist.steps.profile.descriptionDone')
                : t('onboardingChecklist.steps.profile.description')}
          </p>
          {profileLocked ? (
            <button className="oc-btn oc-btn--disabled" disabled>
              <span className="material-symbols-outlined">lock</span>
              {t('onboardingChecklist.steps.profile.lockedAction')}
            </button>
          ) : profileCompleted ? (
            <button className="oc-btn oc-btn--secondary" onClick={onEditProfile}>
              {t('onboardingChecklist.steps.profile.editAction')}
            </button>
          ) : (
            <button className="oc-btn oc-btn--primary" onClick={onSetupProfile}>
              {t('onboardingChecklist.steps.profile.setupAction')}
            </button>
          )}
        </article>

        {/* Step 3 — Subscription */}
        <article className={`oc-step${subscriptionLocked ? ' oc-step--locked' : ''}`}>
          <div className="oc-step__top">
            <div className="oc-step__icon">
              <span className="material-symbols-outlined">payments</span>
            </div>
            <span className={`oc-badge oc-badge--${subscriptionLocked ? 'locked' : subscriptionDone ? 'success' : 'error'}`}>
              {subscriptionLocked
                ? t('onboardingChecklist.steps.subscription.statusLocked')
                : subscriptionDone
                  ? t('onboardingChecklist.steps.subscription.statusDone', { count: activeSubscriptions })
                  : t('onboardingChecklist.steps.subscription.statusNoPlan')}
            </span>
          </div>
          <h3 className="oc-step__title">{t('onboardingChecklist.steps.subscription.title')}</h3>
          <p className="oc-step__desc">
            {subscriptionLocked
              ? t('onboardingChecklist.steps.subscription.descriptionLocked')
              : subscriptionDone
                ? t('onboardingChecklist.steps.subscription.descriptionDone')
                : t('onboardingChecklist.steps.subscription.description')}
          </p>
          {subscriptionLocked ? (
            <button className="oc-btn oc-btn--disabled" disabled>
              <span className="material-symbols-outlined">lock</span>
              {t('onboardingChecklist.steps.subscription.lockedAction')}
            </button>
          ) : subscriptionDone ? (
            <button className="oc-btn oc-btn--primary" onClick={onManagePlans}>
              {t('onboardingChecklist.steps.subscription.manageAction')}
            </button>
          ) : (
            <button className="oc-btn oc-btn--secondary" onClick={onChoosePlan}>
              {t('onboardingChecklist.steps.subscription.choosePlanAction')}
            </button>
          )}
        </article>

      </div>
    </div>
  )
}
