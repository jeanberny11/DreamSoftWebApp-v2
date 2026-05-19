// Navbar — top navigation for the landing app

import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTenantAuthStore } from '@/apps/landingapp/common/tenant_auth.store'
import "../styles/home_page.css"

export function Navbar() {
  const { t } = useTranslation('common')
  const [menuOpen, setMenuOpen] = useState(false)
  const isAuthenticated = useTenantAuthStore((s) => s.isAuthenticated)

  const navLinks = useMemo(() => [
    { label: t('nav.solutions'), href: '#solutions' },
    { label: t('nav.features'),  href: '#features' },
    { label: t('nav.pricing'),   href: '#pricing' },
  ], [t])

  const handleScrollLink = (href: string) => {
    setMenuOpen(false)
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth' })
  }

  return (
    <header className="header">
      <div className="nav-container">

        {/* Logo */}
        <a href="#hero" onClick={() => handleScrollLink('#hero')} className="nav-logo-link">
          <div className="nav-logo-badge">
            <span className="text-sm font-bold text-white">DS</span>
          </div>
          <span className="nav-logo-text">{t('app.name')}</span>
        </a>

        {/* Desktop Nav */}
        <nav className="nav-desktop">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleScrollLink(link.href)}
              className="nav-link"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Desktop right: CTAs */}
        <div className="nav-actions">
          {isAuthenticated ? (
            <Link to="/dashboard" className="nav-cta">{t('nav.dashboard')}</Link>
          ) : (
            <>
              <Link to="/login" className="nav-signin">{t('nav.signIn')}</Link>
              <Link to="/register" className="nav-cta">{t('nav.getStarted')}</Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="nav-hamburger"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen ? 'true' : 'false'}
          aria-controls="mobile-nav"
        >
          <span className={`nav-hamburger-bar ${menuOpen ? 'translate-y-2 rotate-45' : ''}`} />
          <span className={`nav-hamburger-bar ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`nav-hamburger-bar ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div id="mobile-nav" className="nav-mobile-menu">
          <nav className="nav-mobile-nav">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleScrollLink(link.href)}
                className="nav-mobile-link"
              >
                {link.label}
              </button>
            ))}
            <hr className="border-gray-200" />
            {isAuthenticated ? (
              <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="nav-mobile-cta">
                {t('nav.dashboard')}
              </Link>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="nav-mobile-signin">
                  {t('nav.signIn')}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="nav-mobile-cta"
                >
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
