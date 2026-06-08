// PaymentsSection — stub for the Payments History sub-route

import { useTranslation } from 'react-i18next'

export function PaymentsSection() {
  const { t } = useTranslation('landing')
  return (
    <div className="tcp-section-stub">
      <p>{t('tenantControlPanel.sections.payments')}</p>
    </div>
  )
}
