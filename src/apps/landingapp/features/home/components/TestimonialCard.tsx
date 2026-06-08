// TestimonialCard — displays a customer testimonial

import "../styles/home_page.css"

interface TestimonialCardProps {
  quote: string
  author: string
  company?: string
  avatarUrl?: string
}

export function TestimonialCard({ quote, author, company, avatarUrl }: TestimonialCardProps) {
  return (
    <div className="testimonial-card">
      <div className="testimonial-stars">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className="testimonial-star-icon" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <p className="testimonial-quote">"{quote}"</p>
      <div className="testimonial-footer">
        {avatarUrl ? (
          <img src={avatarUrl} alt={author} className="testimonial-avatar" />
        ) : (
          <div className="testimonial-avatar-initials">{author.charAt(0)}</div>
        )}
        <div>
          <p className="testimonial-author">{author}</p>
          {company && <p className="testimonial-company">{company}</p>}
        </div>
      </div>
    </div>
  )
}
