// PricingPage — full pricing page
// TODO: Implement in Phase 2

import { Navbar } from '../home/components/Navbar'
import { Footer } from '../home/components/Footer'
import "../home/styles/home_page.css"

export function PricingPage() {
  return (
    <div className="page-shell">
      <Navbar />
      <main className="page-main--py">
        <div className="page-content">
          <h1 className="text-4xl font-bold text-gray-900">Simple, transparent pricing</h1>
          <p className="mt-4 text-gray-500">Choose the plan that fits your business.</p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
