// LandingApp — public and protected routes for the main domain

import { Routes, Route, Navigate } from 'react-router-dom'
import { useTenantAuth } from './common/hooks/useTenantAuth'
import { HomePage } from './home/pages/HomePage'
import { PricingPage } from './pages/PricingPage'
import { FeaturesPage } from './pages/FeaturesPage'
import { RegisterPage } from './register/pages/RegisterPage'
import { LoginPage } from './login/pages/LoginPage'
import { AccountPage } from './pages/AccountPage'
import { OnboardingPage } from './pages/OnboardingPage'
import { LandingGuestGuard } from './common/guards/LandingGuestGuard'
import { LandingAuthGuard } from './common/guards/LandingAuthGuard'
import { DashboardPage } from './dashboard/pages/DashboardPage'

export function LandingApp() {
  const { isBootstrapping } = useTenantAuth()

  if (isBootstrapping) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-500" />
      </div>
    )
  }

  return (
    <Routes>
      {/* Public routes — accessible to everyone */}
      <Route path="/" element={<HomePage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/features" element={<FeaturesPage />} />

      {/* Guest-only routes — redirect to /dashboard if already authenticated */}
      <Route element={<LandingGuestGuard />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Protected routes — redirect to /login if not authenticated */}
      <Route element={<LandingAuthGuard />}>
        <Route path="/account" element={<AccountPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
