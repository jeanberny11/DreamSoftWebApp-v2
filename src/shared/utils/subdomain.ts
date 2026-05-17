// Subdomain detection utilities

const MAIN_DOMAINS = ['dreamsoft.com', 'www.dreamsoft.com', 'localhost']

/**
 * Returns true if the current hostname is a tenant subdomain.
 */
export function isTenantSubdomain(): boolean {
  const hostname = window.location.hostname
  return !MAIN_DOMAINS.includes(hostname)
}

/**
 * Extracts the subdomain from the current hostname.
 * e.g. "acme.dreamsoft.com" → "acme"
 * Returns null if on the main domain or localhost.
 */
export function getSubdomain(): string | null {
  const hostname = window.location.hostname
  if (MAIN_DOMAINS.includes(hostname)) return null
  const parts = hostname.split('.')
  return parts.length >= 2 ? parts[0] : null
}
