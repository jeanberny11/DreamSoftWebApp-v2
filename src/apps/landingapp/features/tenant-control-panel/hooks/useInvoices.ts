// useInvoices.ts — Composes the URL-driven ?solutionId= param with the
// dateFrom/dateTo filters (page-local state, passed in as args) and feeds
// both into invoices.store, which picks the best single backend endpoint
// for whichever combo is active — see invoices.store.ts for the routing
// logic. Resets on unmount so stale data never flashes when re-entering
// with a different filter.

import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useLanguageStore } from '@/shared/store/language.store'
import { useInvoicesStore } from '../stores/invoices.store'

function parsePositiveIntParam(value: string | null): number | undefined {
  if (value === null) return undefined
  const n = Number(value)
  return Number.isInteger(n) && n > 0 ? n : undefined
}

export function useInvoices(dateFrom?: string, dateTo?: string) {
  const [searchParams] = useSearchParams()
  const langCode = useLanguageStore((s) => s.currentLanguage.code)
  const store = useInvoicesStore()
  const solutionId = parsePositiveIntParam(searchParams.get('solutionId'))

  useEffect(() => {
    store.fetchInvoices(langCode.toUpperCase(), { solutionId, dateFrom, dateTo })
    return () => useInvoicesStore.getState().reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [langCode, solutionId, dateFrom, dateTo])

  return {
    ...store,
    solutionId,
    refetch: () => store.fetchInvoices(langCode.toUpperCase(), { solutionId, dateFrom, dateTo }),
  }
}
