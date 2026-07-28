// change-plan-review.store.ts — Zustand store for the Confirm Plan Change page
//
// Independent, URL-driven (like checkout-review.store) — the page builds
// itself from ?planPriceId= and re-previews whenever the proration timing
// toggle changes. Submit reuses the exact ProrationDate returned by the
// last successful preview so the real charge matches what was shown
// (Stripe's own recommendation for exact preview→commit consistency).

import { create } from "zustand";
import { changePlanService } from "../services/change-plan.service";
import { getErrorMessage } from "@/shared/utils/api.utils";
import type { ChangePlanPreviewResponse } from "../types/change-plan.types";

type PreviewState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: ChangePlanPreviewResponse }
  | { status: "error"; message: string };

type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success" }
  | { status: "error"; message: string };

type ChangePlanReviewStore = {
  preview: PreviewState;
  submitState: SubmitState;

  fetchPreview: (newPlanPriceId: number, prorationImmediate: boolean, language: string) => Promise<void>;
  submit: (newPlanPriceId: number, prorationImmediate: boolean, prorationDate: string) => Promise<void>;
  reset: () => void;
};

export const useChangePlanReviewStore = create<ChangePlanReviewStore>((set) => ({
  preview: { status: "idle" },
  submitState: { status: "idle" },

  fetchPreview: async (newPlanPriceId, prorationImmediate, language) => {
    set({ preview: { status: "loading" } });
    const { data: result } = await changePlanService.previewChangePlan(
      newPlanPriceId, prorationImmediate, language,
    );
    if (result.success) {
      set({ preview: { status: "success", data: result.data } });
    } else {
      set({ preview: { status: "error", message: getErrorMessage(result.error) } });
    }
  },

  submit: async (newPlanPriceId, prorationImmediate, prorationDate) => {
    set({ submitState: { status: "submitting" } });
    const { data: result } = await changePlanService.changePlan(
      newPlanPriceId, prorationImmediate, prorationDate,
    );
    if (result.success) {
      set({ submitState: { status: "success" } });
    } else {
      set({ submitState: { status: "error", message: getErrorMessage(result.error) } });
    }
  },

  reset: () => set({ preview: { status: "idle" }, submitState: { status: "idle" } }),
}));
