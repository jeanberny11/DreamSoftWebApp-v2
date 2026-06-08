// ProfileSection — stub for the Profile sub-route

import { useTranslation } from 'react-i18next'

export function ProfileSection() {
  const { t } = useTranslation('landing')
  return (
    <div className="tcp-section-stub">
      <p>{t('tenantControlPanel.sections.profile')}</p>
    </div>
  )
}
