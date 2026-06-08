// DashboardSection — stub for the Account Dashboard sub-route

import { useTranslation } from 'react-i18next'

export function DashboardSection() {
  const { t } = useTranslation('landing')
  return (
    <div className="tcp-section-stub">
      <p>{t('tenantControlPanel.sections.dashboard')}</p>
    </div>
  )
}
