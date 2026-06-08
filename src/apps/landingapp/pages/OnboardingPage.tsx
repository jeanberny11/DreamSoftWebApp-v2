// OnboardingPage — post-registration setup wizard
// TODO: Implement onboarding wizard steps in Phase 2

import { useNavigate } from 'react-router-dom'
import "../features/home/styles/home_page.css"

export function OnboardingPage() {
  const navigate = useNavigate()

  return (
    <div className="auth-screen">
      <div className="auth-card--wide">
        <h1 className="text-2xl font-bold text-gray-900">Welcome to DreamSoft!</h1>
        <p className="mt-2 text-gray-500">Let's get your workspace set up.</p>
        <button
          type="button"
          onClick={() => navigate('/account')}
          className="auth-btn"
        >
          Go to Account
        </button>
      </div>
    </div>
  )
}
