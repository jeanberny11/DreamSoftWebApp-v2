import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import '../styles/pricing-page.css'

const FAQ_KEYS = ['1', '2', '3'] as const

export function PricingFaqSection() {
  const { t } = useTranslation('landing')
  const [openKey, setOpenKey] = useState<string | null>(null)

  const toggle = (key: string) => setOpenKey((prev) => (prev === key ? null : key))

  return (
    <section className="pricing-faq-section">
      <div className="section-container">
        <div className="section-header">
          <h2 className="section-title">{t('pricingFaq.title')}</h2>
        </div>

        <div className="pricing-faq-list">
          {FAQ_KEYS.map((key) => (
            <div
              key={key}
              className={`pricing-faq-item${openKey === key ? ' pricing-faq-item--open' : ''}`}
            >
              <button
                type="button"
                className="pricing-faq-question"
                onClick={() => toggle(key)}
                aria-expanded={openKey === key}
              >
                <span>{t(`pricingFaq.q${key}`)}</span>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`pricing-faq-chevron${openKey === key ? ' pricing-faq-chevron--open' : ''}`}
                  aria-hidden="true"
                />
              </button>
              {openKey === key && (
                <div className="pricing-faq-answer">
                  <p>{t(`pricingFaq.a${key}`)}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
