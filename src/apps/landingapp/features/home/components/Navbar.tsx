import { useState, useMemo, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTenantAuthStore } from '@/apps/landingapp/common/tenant_auth.store'
import { NavLangButton } from '@/apps/landingapp/common/components/NavLangButton'
import { NavUserButton } from '@/apps/landingapp/common/components/NavUserButton'
import '../styles/navbar.css'

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
