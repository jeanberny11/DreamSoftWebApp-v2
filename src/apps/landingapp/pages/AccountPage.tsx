// AccountPage — subscription management, billing, plan changes
// TODO: Implement full account management in Phase 2

import { Navbar } from '../features/home/components/Navbar'
import { Footer } from '../features/home/components/Footer'
import "../features/home/styles/home_page.css"

export function AccountPage() {
  return (
    <div className="page-shell">
      <Navbar />
      <main className="page-main--py">
        <div className="page-content--left">
          <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
          <p className="mt-2 text-gray-500">Manage your subscription and billing.</p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
