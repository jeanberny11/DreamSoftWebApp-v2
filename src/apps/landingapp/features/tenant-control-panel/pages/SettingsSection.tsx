// SettingsSection — stub for the Settings sub-route

import { useTranslation } from 'react-i18next'

export function SettingsSection() {
  const { t } = useTranslation('landing')
  return (
    <div className="tcp-section-stub">
      <p>{t('tenantControlPanel.sections.settings')}</p>
    </div>
  )
}
