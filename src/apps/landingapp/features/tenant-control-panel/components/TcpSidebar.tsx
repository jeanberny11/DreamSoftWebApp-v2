// TcpSidebar — Lateral navigation menu for the Tenant Control Panel

import { NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTenantAuthStore } from '@/apps/landingapp/common/tenant_auth.store'

export function TcpSidebar() {
  const { t } = useTranslation('landing')
  const clearAuth = useTenantAuthStore((s) => s.clearAuth)
  const navigate = useNavigate()

  const handleLogout = () => {
    clearAuth()
    navigate('/login')
  }

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `tcp-nav-item${isActive ? ' tcp-nav-item--active' : ''}`

  return (
    <aside className="tcp-sidebar">
      {/* Logo */}
      <div className="tcp-sidebar__logo">
        <div className="tcp-sidebar__logo-icon">
          <span className="material-symbols-outlined">cloud_done</span>
        </div>
        <div>
          <p className="tcp-sidebar__logo-title">DreamSoft</p>
          <p className="tcp-sidebar__logo-subtitle">{t('tenantControlPanel.subtitle')}</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="tcp-sidebar__nav">
        <NavLink to="/account/dashboard" className={navItemClass}>
          <span className="material-symbols-outlined">dashboard</span>
          <span>{t('tenantControlPanel.nav.dashboard')}</span>
        </NavLink>

        <p className="tcp-sidebar__group-label">{t('tenantControlPanel.nav.managementGroup')}</p>

        <NavLink to="/account/subscriptions" className={navItemClass}>
          <span className="material-symbols-outlined">subscriptions</span>
          <span>{t('tenantControlPanel.nav.subscriptions')}</span>
        </NavLink>

        <NavLink to="/account/invoices" className={navItemClass}>
          <span className="material-symbols-outlined">receipt_long</span>
          <span>{t('tenantControlPanel.nav.invoices')}</span>
        </NavLink>

        <NavLink to="/account/payments" className={navItemClass}>
          <span className="material-symbols-outlined">history</span>
          <span>{t('tenantControlPanel.nav.payments')}</span>
        </NavLink>

        <p className="tcp-sidebar__group-label">{t('tenantControlPanel.nav.personalGroup')}</p>

        <NavLink to="/account/profile" className={navItemClass}>
          <span className="material-symbols-outlined">person</span>
          <span>{t('tenantControlPanel.nav.profile')}</span>
        </NavLink>

        <NavLink to="/account/settings" className={navItemClass}>
          <span className="material-symbols-outlined">settings</span>
          <span>{t('tenantControlPanel.nav.settings')}</span>
        </NavLink>
      </nav>

      {/* Footer: Log Out */}
      <div className="tcp-sidebar__footer">
        <button className="tcp-nav-item tcp-nav-item--logout" onClick={handleLogout}>
          <span className="material-symbols-outlined">logout</span>
          <span>{t('tenantControlPanel.nav.logout')}</span>
        </button>
      </div>
    </aside>
  )
}
