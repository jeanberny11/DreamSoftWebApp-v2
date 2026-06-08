// InvoicesSection — stub for the Invoices sub-route

import { useTranslation } from 'react-i18next'

export function InvoicesSection() {
  const { t } = useTranslation('landing')
  return (
    <div className="tcp-section-stub">
      <p>{t('tenantControlPanel.sections.invoices')}</p>
    </div>
  )
}
