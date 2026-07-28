// useCheckoutReview.ts — Composes URL params with checkout-review.store
//
// The page builds itself entirely from ?planId=&planPriceId= query params —
// this hook parses/validates them, triggers the fetch, and resolves the
// specific price from the returned plan's price list. It never navigates
// itself (matches the project's state-driven pattern); the page reacts to
// `paramsValid`/`priceResolved` and redirects if either is false.

import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useLanguageStore } from "@/shared/store/language.store";
import { useCheckoutReviewStore } from "../stores/checkout-review.store";
import type { PlanPriceDto } from "@/apps/landingapp/common/types/catalog.types";

function parsePositiveIntParam(value: string | null): number | null {
  if (value === null) return null;
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
}

export function useCheckoutReview() {
  const [searchParams] = useSearchParams();
  const langCode = useLanguageStore((s) => s.currentLanguage.code);
  const store = useCheckoutReviewStore();

  const planId = parsePositiveIntParam(searchParams.get("planId"));
  const planPriceId = parsePositiveIntParam(searchParams.get("planPriceId"));
  const paramsValid = planId !== null && planPriceId !== null;

  useEffect(() => {
    if (paramsValid && store.detail.status === "idle") {
      store.fetchDetail(planId!, langCode.toUpperCase());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsValid, planId, langCode]);

  const price: PlanPriceDto | null = useMemo(() => {
    if (store.detail.status !== "success") return null;
    return store.detail.data.prices.find((p) => p.planPriceId === planPriceId) ?? null;
  }, [store.detail, planPriceId]);

  // Once the plan has loaded successfully, the price MUST be found among its
  // prices — if not, the URL's planPriceId doesn't actually belong to this
  // plan (stale link, tampered URL, etc.) and the page should redirect.
  const priceResolved = store.detail.status !== "success" || price !== null;

  return {
    planId,
    planPriceId,
    paramsValid,
    price,
    priceResolved,
    ...store,
  };
}
