// usePayments.ts — Composes the URL-driven ?solutionId= param with the
// dateFrom/dateTo filters (page-local state, passed in as args) and feeds
// both into payments.store, which picks the best single backend endpoint
// for whichever combo is active — see payments.store.ts for the routing
// logic. Mirrors useInvoices.ts.

import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useLanguageStore } from '@/shared/store/language.store'
import { usePaymentsStore } from '../stores/payments.store'

function parsePositiveIntParam(value: string | null): number | undefined {
  if (value === null) return undefined
  const n = Number(value)
  return Number.isInteger(n) && n > 0 ? n : undefined
}

export function usePayments(dateFrom?: string, dateTo?: string) {
  const [searchParams] = useSearchParams()
  const langCode = useLanguageStore((s) => s.currentLanguage.code)
  const store = usePaymentsStore()
  const solutionId = parsePositiveIntParam(searchParams.get('solutionId'))

  useEffect(() => {
    store.fetchPayments(langCode.toUpperCase(), { solutionId, dateFrom, dateTo })
    return () => usePaymentsStore.getState().reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [langCode, solutionId, dateFrom, dateTo])

  return {
    ...store,
    solutionId,
    refetch: () => store.fetchPayments(langCode.toUpperCase(), { solutionId, dateFrom, dateTo }),
  }
}
