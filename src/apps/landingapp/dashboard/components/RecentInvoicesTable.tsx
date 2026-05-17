import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Skeleton } from 'primereact/skeleton'
import type { Invoice } from '@/apps/tenant/features/invoices/types/invoice.types'
import '../styles/tables.css'

interface RecentInvoicesTableProps {
  invoices: Invoice[]
  isLoading?: boolean
}

type InvoiceStatus = Invoice['status']

const STATUS_LABELS: Record<InvoiceStatus, string> = {
  paid: 'Paid',
  sent: 'Sent',
  draft: 'Draft',
  overdue: 'Overdue',
}

function StatusBadge({ status }: { status: InvoiceStatus }) {
  return (
    <span className={`status-badge status-badge--${status}`}>
      {STATUS_LABELS[status]}
    </span>
  )
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const skeletonRows = Array.from({ length: 5 })

export function RecentInvoicesTable({ invoices, isLoading = false }: RecentInvoicesTableProps) {
  return (
    <div className="table-card">
      <div className="table-card__header">
        <span className="table-card__title">Recent Invoices</span>
        <a href="/invoices" className="table-card__link">See all</a>
      </div>

      {isLoading ? (
        <div style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {skeletonRows.map((_, i) => (
            <Skeleton key={i} height="2.25rem" />
          ))}
        </div>
      ) : (
        <DataTable
          value={invoices}
          className="dashboard-datatable"
          emptyMessage="No recent invoices"
          stripedRows={false}
        >
          <Column field="number" header="Invoice #" />
          <Column field="customerId" header="Customer" />
          <Column
            field="amount"
            header="Amount"
            body={(row: Invoice) => formatCurrency(row.amount)}
          />
          <Column
            field="status"
            header="Status"
            body={(row: Invoice) => <StatusBadge status={row.status} />}
          />
          <Column
            field="dueAt"
            header="Due Date"
            body={(row: Invoice) => formatDate(row.dueAt)}
          />
        </DataTable>
      )}
    </div>
  )
}
