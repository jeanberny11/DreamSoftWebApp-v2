// TcpTopBar — Top bar for the Tenant Control Panel shell

import { useTranslation } from 'react-i18next'
import { useTenantAuthStore } from '@/apps/landingapp/common/tenant_auth.store'

export function TcpTopBar() {
  const { t } = useTranslation('landing')
  const session = useTenantAuthStore((s) => s.session)

  const initials = session
    ? `${session.firstName.charAt(0)}${session.lastName.charAt(0)}`
    : '?'

  return (
    <header className="tcp-topbar">
      <h2 className="tcp-topbar__title">{t('tenantControlPanel.title')}</h2>
      <div className="tcp-topbar__actions">
        <div className="tcp-topbar__avatar" title={session?.email}>
          {initials}
        </div>
      </div>
    </header>
  )
}
