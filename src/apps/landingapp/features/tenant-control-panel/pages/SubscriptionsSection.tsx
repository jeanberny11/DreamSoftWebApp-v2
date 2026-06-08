// SubscriptionsSection — stub for the My Subscriptions sub-route

import { useTranslation } from 'react-i18next'

export function SubscriptionsSection() {
  const { t } = useTranslation('landing')
  return (
    <div className="tcp-section-stub">
      <p>{t('tenantControlPanel.sections.subscriptions')}</p>
    </div>
  )
}
