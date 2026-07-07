// ── App Feature types — matches GET /api/v1/landing/Features/get-main-features ──

export interface MenuOptionDto{
  menuOptionId: number
  code: string
  name: string
  description: string
  icon: string
  sortOrder: number
}

export interface MenuGroupDto{
  menuGroupId: number
  code: string
  name: string
  description: string
  icon: string
  sortOrder: number
  options: MenuOptionDto[]
}

export interface ModuleDto{
  moduleId: number
  code: string
  name: string
  description: string
  icon: string
  sortOrder: number
  groups: MenuGroupDto[]
}

// ── Pricing types — matches GET /api/v1/landing/Pricing ──

export interface BillingCycleDto {
  billingCycleId: number
  code: string
  name: string
  description: string
  months: number
}

export interface PlanPriceDto {
  planPriceId: number
  price: number
  billingCycle: BillingCycleDto
}

export interface PlanLimitDto {
  planLimitId: number
  limitKey: string
  limitValue: number   // 0 = unlimited
  description: string
}

export interface SubscriptionPlanDto {
  planId: number
  code: string
  name: string
  description: string
  limits: PlanLimitDto[]
  prices: PlanPriceDto[]
  features: ModuleDto[]
  trialDays: number
  tierLevel: number    // highest tierLevel = most popular (highlighted)
}

export interface SolutionDto {
  solutionId: number
  code: string
  name: string
  description: string
  icon: string
  plans: SubscriptionPlanDto[]
}

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