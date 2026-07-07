// LandingApp — public and protected routes for the main domain

import { Routes, Route, Navigate } from 'react-router-dom'
import { useTenantAuth } from './common/hooks/useTenantAuth'
import { HomePage } from './features/home/pages/HomePage'
import { SolutionPage } from './features/home/pages/SolutionPage'
import { SolutionDetailPage } from './features/home/pages/SolutionDetailPage'
import { PricingPage } from './features/home/pages/PricingPage'
import { FeaturesCatalogPage } from './features/home/pages/FeaturesCatalogPage'
import { RegisterPage } from './features/register/pages/RegisterPage'
import { LoginPage } from './features/login/pages/LoginPage'
import { TenantControlPanelPage } from './features/tenant-control-panel/pages/TenantControlPanelPage'
import { DashboardPage } from './features/tenant-control-panel/pages/DashboardPage'
import { ProfileSection } from './features/tenant-control-panel/pages/ProfileSection'
import { ProfileEditPage } from './features/tenant-control-panel/pages/ProfileEditPage'
import { SubscriptionsSection } from './features/tenant-control-panel/pages/SubscriptionsSection'
import { VerifyEmailPage } from './features/verify-email/pages/VerifyEmailPage'
import { LandingGuestGuard } from './common/guards/LandingGuestGuard'
import { LandingAuthGuard } from './common/guards/LandingAuthGuard'

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
      <Route path="/solutions" element={<SolutionPage />} />
      <Route path="/solutions/:code" element={<SolutionDetailPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/features" element={<FeaturesCatalogPage />} />

      {/* Guest-only routes — redirect to /account if already authenticated */}
      <Route element={<LandingGuestGuard />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Protected routes — redirect to /login if not authenticated */}
      <Route element={<LandingAuthGuard />}>
        <Route path="/account" element={<TenantControlPanelPage />}>
          <Route index element={<DashboardPage />} />
          <Route path="profile" element={<ProfileSection />} />
          <Route path="profile/edit" element={<ProfileEditPage />} />
          <Route path="subscriptions" element={<SubscriptionsSection />} />
        </Route>
        <Route path="/verify-email" element={<VerifyEmailPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
