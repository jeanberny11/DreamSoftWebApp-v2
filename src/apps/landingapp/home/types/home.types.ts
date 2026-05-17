// ── App Feature types — matches GET /api/v1/admin/AppFeatures ──

export interface AppModule {
  code: string
  name: string
  description: string
  icon: string   // Heroicon name (e.g. "archive-box") — mapped to Font Awesome in the UI
  sortOrder: number
}

export interface AppFeature {
  code: string
  name: string
  description: string
  icon: string   // Heroicon name — mapped to Font Awesome in the UI
  sortOrder: number
  modules: AppModule[]
}

// ── Pricing types — matches GET /api/v1/landing/pricing ──

export type BillingCycleCode = 'MONTHLY' | 'QUARTERLY' | 'ANNUAL'

export interface PlanPrice {
  billingCycleCode: BillingCycleCode
  price: number
}

export interface PlanLimit {
  limitKey: string
  limitValue: number   // 0 = unlimited
  description: string
}

export interface PricingPlan {
  code: string
  name: string
  description: string
  trialDays: number
  tierLevel: number    // highest tierLevel = most popular (highlighted)
  prices: PlanPrice[]
  limits: PlanLimit[]
}

export interface PricingSolution {
  solutionCode: string
  solutionName: string
  solutionDescription: string
  plans: PricingPlan[]
}

// ── Solution types — matches GET /api/v1/admin/Solutions/active ──

export interface Solution {
  id: number
  code: string
  name: string
  description: string
  icon: string        // TODO: implement icon rendering once the API returns real icon values
  sortOrder: number
  isActive: boolean
}
