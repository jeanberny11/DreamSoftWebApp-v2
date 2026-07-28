import { create } from "zustand";
import { subscriptionsService } from "../services/subscriptions.service";
import { getErrorMessage } from "@/shared/utils/api.utils";
import type { SolutionDto } from "@/apps/landingapp/common/types/catalog.types";

type NewSubscriptionState =
  | { status: "idle" }
  | { status: "loading" }
  | {
      status: "success";
      data: SolutionDto[];
      selectedSolutionId: number | null;
      selectedPlanId: number | null;
      selectedPriceId: number | null;
    }
  | { status: "error"; message: string };

type NewSubscriptionStore = {
  state: NewSubscriptionState;

  fetchData: (language: string) => Promise<void>;
  onSelectedSolutionChange: (solutionId: number) => void;
  onSelectedPlanChange: (planId: number) => void;
  onSelectedPriceChange: (priceId: number) => void;
  reset: () => void;
};

export const useNewSubscriptionStore = create<NewSubscriptionStore>(
  (set) => ({
    state: { status: "idle" },

    fetchData: async (language: string) => {
      set({ state: { status: "loading" } });
      const { data: result } = await subscriptionsService.getPricing(language);
      if (result.success) {
        set({
          state: {
            status: "success",
            data: result.data,
            selectedSolutionId: null,
            selectedPlanId: null,
            selectedPriceId: null,
          },
        });
      } else {
        set({
          state: { status: "error", message: getErrorMessage(result.error) },
        });
      }
    },

    onSelectedSolutionChange: (solutionId: number) => {
      set((state) => ({
        state: {
          ...state.state,
          selectedSolutionId: solutionId,
          selectedPlanId: null,
          selectedPriceId: null,
        },
      }));
    },

    onSelectedPlanChange: (planId: number) => {
      set((state) => ({
        state: {
          ...state.state,
          selectedPlanId: planId,
        },
      }));
    },

    onSelectedPriceChange: (priceId: number) => {
      set((state) => ({
        state: {
          ...state.state,
          selectedPriceId: priceId,
        },
      }));
    },

    reset: () =>
      set((state) => ({
        state: {
          ...state.state,
          selectedSolutionId: null,
          selectedPlanId: null,
          selectedPriceId: null,
        },
      })),
  }),
);
