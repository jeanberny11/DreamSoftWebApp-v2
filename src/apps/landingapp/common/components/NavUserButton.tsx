import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { useTenantAuthStore } from '@/apps/landingapp/common/tenant_auth.store'
import neutralProfilePicture from '@/assets/images/neutral_profile_picture.png'

export function NavUserButton() {
  const session = useTenantAuthStore((s) => s.session)
  const clearAuth = useTenantAuthStore((s) => s.clearAuth)
  const navigate = useNavigate()
  const { t } = useTranslation('common')
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const avatarSrc = session?.logoUrl || neutralProfilePicture
  const fullName = session ? `${session.firstName} ${session.lastName}` : ''

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const handleSignOut = () => {
    clearAuth()
    navigate('/home')
    setOpen(false)
  }

  return (
    <div className="nav-user-wrap" ref={ref}>
      <button
        type="button"
        className="nav-user-btn"
        onClick={() => setOpen((o) => !o)}
        aria-label="Account menu"
        aria-expanded={open}
      >
        <img src={avatarSrc} alt="User avatar" className="nav-user-avatar-img" />
      </button>

      {open && (
        <div className="nav-account-panel">
          <div className="nav-account-header">
            <img src={avatarSrc} alt="User avatar" className="nav-account-avatar-lg" />
            <div className="nav-account-name">{fullName}</div>
            <div className="nav-account-email">{session?.email}</div>
            <Link to="/account" className="nav-account-manage" onClick={() => setOpen(false)}>
              {t('nav.manageAccount')}
            </Link>
          </div>
          <div className="nav-account-actions">
            <button type="button" className="nav-account-action">
              <FontAwesomeIcon icon={faUserPlus} className="nav-account-action-icon" aria-hidden="true" />
              {t('nav.addAccount')}
            </button>
          </div>
          <div className="nav-account-footer">
            <button type="button" className="nav-account-signout" onClick={handleSignOut}>
              <FontAwesomeIcon icon={faArrowRightFromBracket} className="nav-account-action-icon" aria-hidden="true" />
              {t('nav.signOut')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
