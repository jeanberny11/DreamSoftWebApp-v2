import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Avatar } from 'primereact/avatar'
import { Skeleton } from 'primereact/skeleton'
import type { Customer } from '@/apps/tenant/features/customers/types/customer.types'
import '../styles/tables.css'

interface RecentCustomersListProps {
  customers: Customer[]
  isLoading?: boolean
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

const skeletonRows = Array.from({ length: 5 })

export function RecentCustomersList({ customers, isLoading = false }: RecentCustomersListProps) {
  const nameBodyTemplate = (customer: Customer) => (
    <div className="customer-avatar-cell">
      <Avatar
        label={getInitials(customer.name)}
        size="normal"
        style={{
          backgroundColor: 'var(--color-primary-100)',
          color: 'var(--color-primary-700)',
          fontWeight: 600,
          fontSize: '0.75rem',
        }}
        shape="circle"
      />
      <div className="customer-avatar-cell__info">
        <span className="customer-avatar-cell__name">{customer.name}</span>
        <span className="customer-avatar-cell__email">{customer.email}</span>
      </div>
    </div>
  )

  return (
    <div className="table-card">
      <div className="table-card__header">
        <span className="table-card__title">Recent Customers</span>
        <a href="/customers" className="table-card__link">See all</a>
      </div>

      {isLoading ? (
        <div style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {skeletonRows.map((_, i) => (
            <Skeleton key={i} height="2.25rem" />
          ))}
        </div>
      ) : (
        <DataTable
          value={customers}
          className="dashboard-datatable"
          emptyMessage="No recent customers"
          stripedRows={false}
        >
          <Column header="Name" body={nameBodyTemplate} />
          <Column field="phone" header="Phone" body={(row: Customer) => row.phone ?? '—'} />
          <Column
            field="createdAt"
            header="Joined"
            body={(row: Customer) => formatDate(row.createdAt)}
          />
        </DataTable>
      )}
    </div>
  )
}
