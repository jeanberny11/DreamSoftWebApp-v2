// Invoices feature — types
// TODO: Expand with full invoice domain types

export interface Invoice {
  id: string
  number: string
  customerId: string
  amount: number
  status: 'draft' | 'sent' | 'paid' | 'overdue'
  issuedAt: string
  dueAt: string
}
