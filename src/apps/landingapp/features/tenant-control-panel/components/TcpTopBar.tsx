import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { NavLangButton } from '@/apps/landingapp/common/components/NavLangButton'
import { NavUserButton } from '@/apps/landingapp/common/components/NavUserButton'
import '@/apps/landingapp/features/home/styles/navbar.css'

export function TcpTopBar() {
  const { t } = useTranslation('landing')

  return (
    <header className="tcp-topbar">
      <div className="tcp-topbar__left">
        <Link to="/home" className="tcp-topbar__back" aria-label={t('tenantControlPanel.backToHome')}>
          <span className="material-symbols-outlined">home</span>
        </Link>
        <h2 className="tcp-topbar__title">{t('tenantControlPanel.title')}</h2>
      </div>
      <div className="tcp-topbar__actions">
        <NavLangButton />
        <NavUserButton />
      </div>
    </header>
  )
}
