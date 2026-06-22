// General formatting utilities

/**
 * Formats a number as currency.
 * e.g. formatCurrency(1234.5, 'USD') → "$1,234.50"
 */
export function formatCurrency(amount: number, currency = 'USD', locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount)
}

/**
 * Formats an ISO date string to a readable date.
 * e.g. formatDate("2024-01-15T00:00:00Z") → "Jan 15, 2024"
 */
export function formatDate(isoString: string, locale = 'en-US'): string {
  return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'short', day: 'numeric' }).format(
    new Date(isoString)
  )
}

/**
 * Formats an ISO date string to "Month Year".
 * e.g. formatMonthYear("2025-06-15T00:00:00Z") → "June 2025"
 */
export function formatMonthYear(isoString: string, locale = 'en-US'): string {
  return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long' }).format(
    new Date(isoString)
  )
}

/**
 * Formats an ISO date string as a relative time string.
 * e.g. formatRelativeTime("2026-06-18T00:00:00Z") → "2 days ago"
 * Falls back to formatDate once the difference reaches/exceeds ~30 days,
 * so old updates show a real date instead of an imprecise "N months ago".
 */
export function formatRelativeTime(isoString: string, locale = 'en-US'): string {
  const date = new Date(isoString)
  const diffMs = date.getTime() - Date.now()
  const diffSeconds = Math.round(diffMs / 1000)
  const diffMinutes = Math.round(diffSeconds / 60)
  const diffHours = Math.round(diffMinutes / 60)
  const diffDays = Math.round(diffHours / 24)

  if (Math.abs(diffDays) >= 30) {
    return formatDate(isoString, locale)
  }

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
  if (Math.abs(diffDays) >= 1) return rtf.format(diffDays, 'day')
  if (Math.abs(diffHours) >= 1) return rtf.format(diffHours, 'hour')
  if (Math.abs(diffMinutes) >= 1) return rtf.format(diffMinutes, 'minute')
  return rtf.format(diffSeconds, 'second')
}

/**
 * Capitalizes the first letter of a string.
 */
export function capitalize(str: string): string {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Truncates a string to a max length and appends ellipsis.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength) + '...'
}
