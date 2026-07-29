// checkout-review.store.ts — Zustand store for the Checkout Review page
//
// Independent of new-subscription.store.ts on purpose — this page is
// reachable directly via URL params (?planId=&planPriceId=) from anywhere,
// not just from the picker, so it owns its own fetch/submit lifecycle.

import { create } from "zustand";
import { checkoutReviewService } from "../services/checkout-review.service";
import { subscriptionsService } from "../services/subscriptions.service";
import { getErrorMessage } from "@/shared/utils/api.utils";
import type { CheckoutDetailDto } from "../types/checkout-review.types";

type DetailState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: CheckoutDetailDto }
  | { status: "error"; message: string };

type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "error"; message: string };

type CheckoutReviewStore = {
  detail: DetailState;
  submitState: SubmitState;

  fetchDetail: (planId: number, language: string) => Promise<void>;
  submit: (planId: number, planPriceId: number) => Promise<void>;
  reset: () => void;
};

export const useCheckoutReviewStore = create<CheckoutReviewStore>((set) => ({
  detail: { status: "idle" },
  submitState: { status: "idle" },

  fetchDetail: async (planId: number, language: string) => {
    set({ detail: { status: "loading" } });
    const { data: result } = await checkoutReviewService.getCheckoutDetail(planId, language);
    if (result.success) {
      set({ detail: { status: "success", data: result.data } });
    } else {
      set({ detail: { status: "error", message: getErrorMessage(result.error) } });
    }
  },

  submit: async (planId: number, planPriceId: number) => {
    set({ submitState: { status: "submitting" } });
    const { data: result } = await subscriptionsService.createSubscription(planId, planPriceId);
    if (result.success) {
      window.location.href = result.data.checkoutUrl;
    } else {
      set({ submitState: { status: "error", message: getErrorMessage(result.error) } });
    }
  },

  reset: () => set({ detail: { status: "idle" }, submitState: { status: "idle" } }),
}));
