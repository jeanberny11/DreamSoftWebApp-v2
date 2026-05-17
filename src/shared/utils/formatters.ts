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
