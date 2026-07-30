// Subdomain detection utilities

// Comma-separated via VITE_MAIN_DOMAINS, falls back to the hardcoded defaults.
// Add your production domain(s) here via the Railway env var until every
// deployment target is finalized.
const MAIN_DOMAINS = (import.meta.env.VITE_MAIN_DOMAINS as string | undefined)
  ?.split(',')
  .map((d) => d.trim())
  .filter(Boolean) ?? ['dreamsoft.com', 'www.dreamsoft.com', 'localhost']

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
