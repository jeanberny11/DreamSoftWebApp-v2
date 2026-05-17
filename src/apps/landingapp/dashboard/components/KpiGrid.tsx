import { KpiCard } from './KpiCard'
import type { DashboardStats } from '../types/dashboard.types'
import '../styles/kpi-card.css'

interface KpiGridProps {
  stats: DashboardStats
  isLoading: boolean
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

export function KpiGrid({ stats, isLoading }: KpiGridProps) {
  return (
    <div className="kpi-grid">
      <KpiCard
        title="Total Revenue"
        value={formatCurrency(stats.totalRevenue)}
        icon="pi pi-dollar"
        iconVariant="primary"
        trend="+12%"
        trendDirection="up"
        isLoading={isLoading}
      />
      <KpiCard
        title="Pending Invoices"
        value={String(stats.pendingInvoices)}
        icon="pi pi-file"
        iconVariant="warning"
        isLoading={isLoading}
      />
      <KpiCard
        title="Overdue Invoices"
        value={String(stats.overdueInvoices)}
        icon="pi pi-exclamation-triangle"
        iconVariant="error"
        isLoading={isLoading}
      />
      <KpiCard
        title="Total Customers"
        value={String(stats.totalCustomers)}
        icon="pi pi-users"
        iconVariant="secondary"
        trend="+5%"
        trendDirection="up"
        isLoading={isLoading}
      />
    </div>
  )
}
