// Customers feature — types
// TODO: Expand with full customer domain types

export interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  createdAt: string
}
