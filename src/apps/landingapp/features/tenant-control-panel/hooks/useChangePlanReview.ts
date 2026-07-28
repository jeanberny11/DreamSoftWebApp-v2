// useChangePlanReview.ts — Composes ?planPriceId= with change-plan-review.store
//
// Re-previews whenever the proration timing toggle changes (immediate vs
// next cycle) — each toggle produces a genuinely different number. Confirm
// echoes back the exact ProrationDate from the last successful preview so
// the real charge matches what was shown (Stripe's recommendation).

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useLanguageStore } from "@/shared/store/language.store";
import { useChangePlanReviewStore } from "../stores/change-plan-review.store";

function parsePositiveIntParam(value: string | null): number | null {
  if (value === null) return null;
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
}

export function useChangePlanReview() {
  const [searchParams] = useSearchParams();
  const langCode = useLanguageStore((s) => s.currentLanguage.code);
  const store = useChangePlanReviewStore();

  const newPlanPriceId = parsePositiveIntParam(searchParams.get("planPriceId"));
  const paramsValid = newPlanPriceId !== null;

  const [prorationImmediate, setProrationImmediate] = useState(true);

  useEffect(() => {
    if (paramsValid) {
      store.fetchPreview(newPlanPriceId!, prorationImmediate, langCode.toUpperCase());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsValid, newPlanPriceId, prorationImmediate, langCode]);

  const confirm = () => {
    if (store.preview.status !== "success" || newPlanPriceId === null) return;
    store.submit(newPlanPriceId, prorationImmediate, store.preview.data.prorationDate);
  };

  return {
    newPlanPriceId,
    paramsValid,
    prorationImmediate,
    setProrationImmediate,
    confirm,
    refetch: () =>
      paramsValid &&
      store.fetchPreview(newPlanPriceId!, prorationImmediate, langCode.toUpperCase()),
    ...store,
  };
}
