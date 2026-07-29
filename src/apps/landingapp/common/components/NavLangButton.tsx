import { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGlobe, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { useLanguageStore } from '@/shared/store/language.store'
import type { Language } from '@/shared/types/language.types'

export function NavLangButton() {
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

  return (
    <div className="nav-lang-wrap" ref={ref}>
      <button type="button" className="nav-lang-btn" onClick={() => setOpen((o) => !o)} aria-label="Switch language">
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
