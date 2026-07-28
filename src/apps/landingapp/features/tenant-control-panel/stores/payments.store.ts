// payments.store.ts — Zustand store for the Tenant Payments History feature (GET)
//
// "Cubit equivalent" — handles read/display state for the flat payment-attempt
// ledger. Mirrors invoices.store.ts: the backend exposes 4 separate
// single-purpose endpoints (no combined filter), so fetchPayments picks
// whichever ONE endpoint best matches the active filter combo:
//   - solutionId set                      -> GET /payment/solution/{id}
//   - no solutionId, full dateFrom+dateTo -> GET /payment/by-date-range
//   - neither (or an incomplete/invalid range) -> GET /payment (all)
// When solutionId AND a date range are both active, the solution-scoped
// list is fetched and the date range is applied client-side on top
// (PaymentsSection's `filtered` array already does this).

import { create } from 'zustand'
import { paymentsService } from '../services/payments.service'
import { getErrorMessage } from '@/shared/utils/api.utils'
import type { PaymentHistoryDto } from '../types/payments.types'

export interface PaymentFilters {
  solutionId?: number
  dateFrom?:   string // 'yyyy-MM-dd', from a native <input type="date">
  dateTo?:     string // 'yyyy-MM-dd'
}

type PaymentsStoreState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: PaymentHistoryDto[] }
  | { status: 'error';   message: string }

type PaymentsStore = PaymentsStoreState & {
  fetchPayments: (language: string, filters?: PaymentFilters) => Promise<void>
  reset:         () => void
}

function toStartOfDayIso(date: string): string {
  return `${date}T00:00:00.000`
}

function toEndOfDayIso(date: string): string {
  return `${date}T23:59:59.999`
}

export const usePaymentsStore = create<PaymentsStore>((set) => ({
  status: 'idle',

  fetchPayments: async (language: string, filters?: PaymentFilters) => {
    set({ status: 'loading' })

    const { solutionId, dateFrom, dateTo } = filters ?? {}
    const hasValidRange = !!dateFrom && !!dateTo && dateTo >= dateFrom

    const request = solutionId
      ? paymentsService.getPaymentsBySolution(solutionId, language)
      : hasValidRange
        ? paymentsService.getPaymentsByDateRange(toStartOfDayIso(dateFrom!), toEndOfDayIso(dateTo!), language)
        : paymentsService.getPayments(language)

    const { data: result } = await request
    if (result.success) {
      set({ status: 'success', data: result.data })
    } else {
      set({ status: 'error', message: getErrorMessage(result.error) })
    }
  },

  reset: () => set({ status: 'idle' }),
}))
