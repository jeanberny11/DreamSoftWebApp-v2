import { useEffect, useState } from 'react'
import { invoicesService } from '@/apps/tenant/features/invoices/services/invoices.service'
import { customersService } from '@/apps/tenant/features/customers/services/customers.service'
import type { Invoice } from '@/apps/tenant/features/invoices/types/invoice.types'
import type { Customer } from '@/apps/tenant/features/customers/types/customer.types'
import type { DashboardStats } from '../types/dashboard.types'

interface DashboardData {
  stats: DashboardStats
  recentInvoices: Invoice[]
  recentCustomers: Customer[]
  isLoading: boolean
  error: string | null
}

export function useDashboardData(): DashboardData {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])

  useEffect(() => {
    Promise.all([invoicesService.getAll(), customersService.getAll()])
      .then(([inv, cust]) => {
        if (!inv.success || !cust.success) {
          setError('Failed to load dashboard data')
          return
        }
        setInvoices(inv.data)
        setCustomers(cust.data)
      })
      .catch(() => setError('Failed to load dashboard data'))
      .finally(() => setIsLoading(false))
  }, [])

  const stats: DashboardStats = {
    totalRevenue: invoices
      .filter((i) => i.status === 'paid')
      .reduce((sum, i) => sum + i.amount, 0),
    pendingInvoices: invoices.filter((i) => i.status === 'sent' || i.status === 'draft').length,
    overdueInvoices: invoices.filter((i) => i.status === 'overdue').length,
    totalCustomers: customers.length,
  }

  const recentInvoices = [...invoices]
    .sort((a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime())
    .slice(0, 5)

  const recentCustomers = [...customers]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  return { stats, recentInvoices, recentCustomers, isLoading, error }
}
