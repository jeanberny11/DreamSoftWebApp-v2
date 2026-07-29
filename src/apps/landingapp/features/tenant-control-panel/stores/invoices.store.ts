// invoices.store.ts — Zustand store for the Tenant Invoices feature (GET)
//
// "Cubit equivalent" — handles read/display state for the invoices list.
// The backend exposes 4 separate single-purpose endpoints (no combined
// filter), so fetchInvoices picks whichever ONE endpoint best matches the
// active filter combo, to avoid client-side filtering wherever possible:
//   - solutionId set                      -> GET /invoice/solution/{id}
//   - no solutionId, full dateFrom+dateTo -> GET /invoice/by-date-range
//   - neither (or an incomplete/invalid range) -> GET /invoice (all)
// When solutionId AND a date range are both active at once, there's no
// combined endpoint on the backend — the solution-scoped list is fetched
// and the date range is applied client-side on top (InvoicesSection's
// `filtered` array already does this; it's a no-op when the range was
// already applied server-side).

import { create } from 'zustand'
import { invoicesService } from '../services/invoices.service'
import { getErrorMessage } from '@/shared/utils/api.utils'
import type { InvoiceDto } from '../types/invoices.types'

export interface InvoiceFilters {
  solutionId?: number
  dateFrom?:   string // 'yyyy-MM-dd', from a native <input type="date">
  dateTo?:     string // 'yyyy-MM-dd'
}

type InvoicesStoreState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: InvoiceDto[] }
  | { status: 'error';   message: string }

type InvoicesStore = InvoicesStoreState & {
  fetchInvoices: (language: string, filters?: InvoiceFilters) => Promise<void>
  reset:         () => void
}

function toStartOfDayIso(date: string): string {
  return `${date}T00:00:00.000`
}

function toEndOfDayIso(date: string): string {
  return `${date}T23:59:59.999`
}

export const useInvoicesStore = create<InvoicesStore>((set) => ({
  status: 'idle',

  fetchInvoices: async (language: string, filters?: InvoiceFilters) => {
    set({ status: 'loading' })

    const { solutionId, dateFrom, dateTo } = filters ?? {}
    const hasValidRange = !!dateFrom && !!dateTo && dateTo >= dateFrom

    const request = solutionId
      ? invoicesService.getInvoicesBySolution(solutionId, language)
      : hasValidRange
        ? invoicesService.getInvoicesByDateRange(toStartOfDayIso(dateFrom!), toEndOfDayIso(dateTo!), language)
        : invoicesService.getInvoices(language)

    const { data: result } = await request
    if (result.success) {
      set({ status: 'success', data: result.data })
    } else {
      set({ status: 'error', message: getErrorMessage(result.error) })
    }
  },

  reset: () => set({ status: 'idle' }),
}))
