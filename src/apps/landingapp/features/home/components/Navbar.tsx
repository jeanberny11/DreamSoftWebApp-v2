import { useState, useMemo, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGlobe, faChevronDown, faUserPlus, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { useTenantAuthStore } from '@/apps/landingapp/common/tenant_auth.store'
import { useLanguageStore } from '@/shared/store/language.store'
import type { Language } from '@/shared/types/language.types'
import neutralProfilePicture from '@/assets/images/neutral_profile_picture.png'
import '../styles/navbar.css'

function NavLangButton() {
  const { languages, currentLanguage, changeLanguage } = useLanguageStore()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const toggle = () => setOpen((o) => !o)

  return (
    <div className="nav-lang-wrap" ref={ref}>
      <button type="button" className="nav-lang-btn" onClick={toggle} aria-label="Switch language">
        <FontAwesomeIcon icon={faGlobe} aria-hidden="true" />
        <span className="nav-lang-code">{currentLanguage.code.toUpperCase()}</span>
        <FontAwesomeIcon icon={faChevronDown} className="nav-lang-chevron" aria-hidden="true" />
      </button>
      {open && (
        <div className="nav-lang-dropdown" role="listbox">
          {languages.map((lang: Language) => (
            <button
              key={lang.code}
              type="button"
              role="option"
              aria-selected={lang.code === currentLanguage.code}
              className={`nav-lang-option${lang.code === currentLanguage.code ? ' nav-lang-option--active' : ''}`}
              onClick={() => { changeLanguage(lang); setOpen(false) }}
            >
              {lang.name} ({lang.code.toUpperCase()})
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function NavUserButton() {
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

export function Navbar() {
  const { t } = useTranslation('common')
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const isAuthenticated = useTenantAuthStore((s) => s.isAuthenticated)
  const session = useTenantAuthStore((s) => s.session)
  const clearAuth = useTenantAuthStore((s) => s.clearAuth)
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = useMemo(() => [
    { label: t('nav.solutions'), to: '/solutions' },
    { label: t('nav.features'),  to: '/features' },
    { label: t('nav.pricing'),   to: '/pricing' },
  ], [t])

  return (
    <header className={`nav-header${scrolled ? ' nav-header--scrolled' : ''}`}>

      <Link to="/home" className="nav-logo">
        <div className="nav-logo-badge">DS</div>
        <span className="nav-logo-text">{t('app.name')}</span>
      </Link>

      {/* Stitch: <nav class="hidden md:flex items-center gap-8"> */}
      <nav className="nav-links">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* Desktop right: language + auth */}
      {/* Stitch: <div class="flex items-center gap-4"> */}
      <div className="nav-actions">
        <NavLangButton />
        {isAuthenticated ? (
          <NavUserButton />
        ) : (
          <>
            <Link to="/login" className="nav-signin">{t('nav.signIn')}</Link>
            <Link to="/register" className="nav-cta">{t('nav.getStarted')}</Link>
          </>
        )}
      </div>

      {/* Mobile hamburger */}
      <button
        type="button"
        className="nav-hamburger"
        onClick={() => setMenuOpen((o) => !o)}
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
        aria-controls="mobile-nav"
      >
        <span className={`nav-hamburger-bar ${menuOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
        <span className={`nav-hamburger-bar ${menuOpen ? 'opacity-0' : ''}`} />
        <span className={`nav-hamburger-bar ${menuOpen ? 'translate-y-[-7px] -rotate-45' : ''}`} />
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div id="mobile-nav" className="nav-mobile-menu">
          <nav className="nav-mobile-nav">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => `nav-mobile-link${isActive ? ' nav-mobile-link--active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
            <hr className="nav-mobile-divider" />
            <NavLangButton />
            <hr className="nav-mobile-divider" />
            {isAuthenticated ? (
              <>
                <div className="nav-mobile-user-email">{session ? `${session.firstName} ${session.lastName}` : ''}</div>
                <Link to="/account" onClick={() => setMenuOpen(false)} className="nav-mobile-cta">
                  {t('nav.manageAccount')}
                </Link>
                <button
                  type="button"
                  className="nav-mobile-signout"
                  onClick={() => { clearAuth(); navigate('/login'); setMenuOpen(false) }}
                >
                  {t('nav.signOut')}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="nav-mobile-signin">
                  {t('nav.signIn')}
                </Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="nav-mobile-cta">
                  {t('nav.getStarted')}
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
