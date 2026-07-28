// checkout-review.types.ts — Types for the Checkout Review page
//
// Mirrors the backend's CheckoutDetailDto (GET /api/v1/landing/Pricing/checkout-detail).
// Deliberately independent of the New Subscription picker's types — this page
// is reachable directly via URL params and must be able to build its own
// view of the world from a single planId, without depending on picker state.

import type { PlanLimitDto, PlanPriceDto } from "@/apps/landingapp/common/types/catalog.types";

export interface CheckoutDetailDto {
  solutionId: number;
  solutionCode: string;
  solutionName: string;
  solutionIcon: string;
  planId: number;
  planCode: string;
  planName: string;
  planDescription: string;
  trialDays: number;
  limits: PlanLimitDto[];
  prices: PlanPriceDto[];
}
