// ── Non-catalog types kept in home ──────────────────────────────────────────
// (Solution/Plan/Pricing/Features catalog types moved to
// @/apps/landingapp/common/types/catalog.types)

export interface BillingCycle {
  code: string
  name: string
  description: string
  months: number
}

export interface SolutionResponse {
  solutionId:number
  code: string
  name: string
  description: string
  icon: string
}
