// TenantApp — menu-driven dynamic routing
// 1. On mount: silently refresh access token (httpOnly cookie)
// 2. If authenticated: fetch menu and build routes from it
// 3. AuthGuard protects all routes → redirect to /login if not authenticated
// 4. PermissionGuard checks each route against the menu → 403 if not permitted

import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthGuard } from '@/shared/guards/AuthGuard'
import { TenantLayout } from './layout/TenantLayout'
import { DashboardPage } from './pages/DashboardPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { useTenantAuth } from '@/apps/landingapp/common/hooks/useTenantAuth'
import { useMenu } from './hooks/useMenu'
import { LoginPage } from '@/apps/landingapp/login/pages/LoginPage'

export function TenantApp() {
  const { isBootstrapping } = useTenantAuth()
  useMenu()

  if (isBootstrapping) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-500" />
      </div>
    )
  }

  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected — requires authentication */}
      <Route element={<AuthGuard />}>
        <Route element={<TenantLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />

          {/*
            TODO: Dynamic module routes will be added here as features are built.
            Each route maps 1:1 to a path returned by the GET /api/v1/auth/menu API.
            Example:
              <Route path="/invoices" element={<InvoicesPage />} />
              <Route path="/customers" element={<CustomersPage />} />
          */}

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
    </Routes>
  )
}
