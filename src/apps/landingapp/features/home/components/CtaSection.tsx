// CtaSection — final conversion section before the footer

import { Link } from 'react-router-dom'
import "../styles/home_page.css"

export function CtaSection() {
  return (
    <section className="cta-section">
      <div className="cta-inner">
        <h2 className="cta-title">
          Ready to transform your business?
        </h2>
        <p className="cta-subtitle">
          Start your 14-day free trial today. No credit card required.
          Cancel anytime.
        </p>
        <div className="cta-actions">
          <Link to="/register" className="cta-btn-primary">
            Get started for free
          </Link>
          <Link to="/pricing" className="cta-btn-outline">
            View pricing
          </Link>
        </div>
        <p className="cta-footnote">
          Already have an account?{' '}
          <Link to="/login" className="cta-footnote-link">Sign in</Link>
        </p>
      </div>
    </section>
  )
}
