// token.ts — Independent in-memory token slot per app context.
// Tokens are never stored in localStorage — memory only for security.
// Each app context (tenant, erp, admin) has its own isolated slot so
// concurrent sessions across contexts never interfere with each other.

const tokens: Record<TokenContext, string | null> = {
  tenant: null,
  erp:    null,
  admin:  null,
}

export type TokenContext = 'tenant' | 'erp' | 'admin'

export function getToken(ctx: TokenContext): string | null {
  return tokens[ctx]
}

export function setToken(ctx: TokenContext, token: string): void {
  tokens[ctx] = token
}

export function clearToken(ctx: TokenContext): void {
  tokens[ctx] = null
}
