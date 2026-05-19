import { useDashboardData } from '../hooks/useDashboardData'
import { KpiGrid } from '../components/KpiGrid'
import { RevenueChart } from '../components/RevenueChart'
import { InvoiceStatusChart } from '../components/InvoiceStatusChart'
import { RecentInvoicesTable } from '../components/RecentInvoicesTable'
import { RecentCustomersList } from '../components/RecentCustomersList'
import '../styles/dashboard.css'

export function DashboardPage() {
  const { stats, recentInvoices, recentCustomers, isLoading, error } = useDashboardData()

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">Welcome back! Here's what's happening with your business.</p>
        </div>
      </div>

      {error && (
        <div className="dashboard-error-banner" role="alert">
          {error}
        </div>
      )}

      <KpiGrid stats={stats} isLoading={isLoading} />

      <div className="dashboard-charts-row">
        <RevenueChart isLoading={isLoading} />
        <InvoiceStatusChart invoices={recentInvoices} isLoading={isLoading} />
      </div>

      <RecentInvoicesTable invoices={recentInvoices} isLoading={isLoading} />

      <RecentCustomersList customers={recentCustomers} isLoading={isLoading} />
    </div>
  )
}
