// TestimonialsSection — social proof from real customers

import { TestimonialCard } from './TestimonialCard'
import "../styles/home_page.css"

const testimonials = [
  {
    quote: 'DreamSoft replaced three separate tools for us. Invoicing, inventory, and reporting are now all in one place. The team got up to speed in days, not weeks.',
    author: 'Maria Gonzalez',
    company: 'CEO at BluePeak Solutions',
  },
  {
    quote: 'The multi-tenant support is exactly what our agency needed. We manage 12 client accounts from a single dashboard without any data leaking between them.',
    author: 'James Carter',
    company: 'Operations Manager at NovaTech',
  },
  {
    quote: 'The analytics dashboards are incredibly clear. Our CFO finally has the real-time financial visibility she needed without waiting for monthly reports.',
    author: 'Sarah Kim',
    company: 'Finance Director at Meridian Inc.',
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="testimonials-section">
      <div className="section-container">
        <div className="section-header">
          <p className="section-eyebrow">Testimonials</p>
          <h2 className="section-title">What our customers say</h2>
          <p className="section-subtitle">Hundreds of teams trust DreamSoft to run their daily operations.</p>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((t) => (
            <TestimonialCard key={t.author} quote={t.quote} author={t.author} company={t.company} />
          ))}
        </div>
      </div>
    </section>
  )
}
