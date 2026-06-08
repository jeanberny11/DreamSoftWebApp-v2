// ── App Feature types — matches GET /api/v1/admin/AppFeatures ──

export interface AppFeatureOption {
  code: string
  name: string
  description: string
  icon: string
  sortOrder: number
}

export interface AppFeature {
  code: string
  name: string
  description: string
  icon: string
  sortOrder: number
  options: AppFeatureOption[]
}

export interface BillingCycle {
  code: string
  name: string
  description: string
  months: number
}

export interface PlanPrice {
  billingCycle: BillingCycle
  price: number
}

export interface SolutionDetailPlanPrice{
  billingCycleCode: string
  billingCycleName: string
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

export interface SolutionFeature {
  code: string
  name: string
  description: string
  iconUrl: string
}

export interface Solution {
  code: string
  name: string
  description: string
  iconUrl: string
  features: SolutionFeature[]
}

// ── Solution Detail types — matches GET /api/v1/landing/Solutions-Features/{code} ──

export interface SolutionDetailOption {
  code: string
  name: string
  description: string
  iconUrl: string
  sortOrder: number
  moduleCode: string
  moduleName: string
  groupCode: string
  groupName: string
}

export interface SolutionDetailPlan {
  code: string
  name: string
  description: string
  trialDays: number
  tierLevel: number
  prices: SolutionDetailPlanPrice[]
  limits: PlanLimit[]
  options: SolutionDetailOption[]
}

export interface SolutionDetail {
  code: string
  name: string
  description: string
  iconUrl: string
  plans: SolutionDetailPlan[]
}

// ── Features Catalog types — matches GET /api/v1/landing/Features/GetAllFeatures ──

export interface FeatureCatalogOption {
  code: string
  name: string
  description: string
  icon: string
  sortOrder: number
}

export interface FeatureCatalogGroup {
  code: string
  name: string
  description: string
  icon: string
  sortOrder: number
  options: FeatureCatalogOption[]
}

export interface FeatureCatalogItem {
  code: string
  name: string
  description: string
  icon: string
  sortOrder: number
  groups: FeatureCatalogGroup[]
}
