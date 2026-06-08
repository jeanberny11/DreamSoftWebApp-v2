// Footer — expanded multi-column site-wide footer

import { Link } from 'react-router-dom'
import "../styles/home_page.css"

const links = {
  Product: [
    { label: 'Features', to: '/features' },
    { label: 'Pricing', to: '/pricing' },
    { label: 'Changelog', to: '#' },
    { label: 'Roadmap', to: '#' },
  ],
  Company: [
    { label: 'About', to: '#' },
    { label: 'Blog', to: '#' },
    { label: 'Careers', to: '#' },
    { label: 'Press', to: '#' },
  ],
  Support: [
    { label: 'Help Center', to: '#' },
    { label: 'Contact Us', to: '#' },
    { label: 'Status', to: '#' },
    { label: 'Community', to: '#' },
  ],
  Legal: [
    { label: 'Privacy Policy', to: '#' },
    { label: 'Terms of Service', to: '#' },
    { label: 'Cookie Policy', to: '#' },
    { label: 'Security', to: '#' },
  ],
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-logo-link">
              <div className="footer-logo-badge">
                <span className="text-sm font-bold text-white">DS</span>
              </div>
              <span className="footer-brand-name">DreamSoft</span>
            </Link>
            <p className="footer-tagline">
              The all-in-one ERP platform for modern teams.
            </p>
          </div>
          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <h4 className="footer-col-title">{group}</h4>
              <ul className="footer-link-list">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link to={item.to} className="footer-link">{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <p className="footer-copyright">© {new Date().getFullYear()} DreamSoft. All rights reserved.</p>
          <div className="footer-legal-links">
            <Link to="#" className="footer-legal-link">Privacy</Link>
            <Link to="#" className="footer-legal-link">Terms</Link>
            <Link to="#" className="footer-legal-link">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
