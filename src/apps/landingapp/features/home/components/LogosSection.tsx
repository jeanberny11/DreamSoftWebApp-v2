// LogosSection — "Trusted by" company logo strip

import { useTranslation } from "react-i18next"
import "../styles/home_page.css"

const companies = ['Acme Corp', 'NovaTech', 'BluePeak', 'Stratford Co.', 'Meridian Inc.', 'Orbis Group']

export function LogosSection() {
  const { t } = useTranslation('landing')
  return (
    <section className="logos-section">
      <div className="section-container">
        <p className="logos-label">{t('logos.trustedBy')}</p>
        <div className="logos-grid">
          {companies.map((name) => (
            <span key={name} className="logo-name">{name}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
