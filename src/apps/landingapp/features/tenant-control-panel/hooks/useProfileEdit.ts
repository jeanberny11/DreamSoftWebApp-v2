import { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { RootState, AppDispatch } from "@/shared/store/store";
import {
  profileEditThunk,
  resetProfileEdit,
} from "../stores/profile-edit.slice";
import { countryApi } from "@/apps/landingapp/common/api/country.api";
import { provinceApi } from "@/apps/landingapp/common/api/province.api";
import { municipalityApi } from "@/apps/landingapp/common/api/municipality.api";
import type { Country } from "@/apps/landingapp/common/types/country.types";
import type { Province } from "@/apps/landingapp/common/types/province.types";
import type { Municipality } from "@/apps/landingapp/common/types/municipality.types";
import type { FormValues } from "../types/profile.types";
import type { ResourceState } from "@/shared/types/resource.state";
import { profileService } from "../services/profile.service";
import { getErrorMessage } from "@/shared/utils/api.utils";
import { useLanguageStore } from "@/shared/store/language.store";

export function useProfileEdit() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { t } = useTranslation("profile");
  const langCode = useLanguageStore((s) => s.currentLanguage.code);
  const profileEditState = useSelector((state: RootState) => state.profileEdit);

  const [prefillState, setPrefillState] = useState<ResourceState<FormValues>>({
    status: "idle",
  });
  const [countriesState, setCountriesState] = useState<
    ResourceState<Country[]>
  >({
    status: "idle",
  });
  const [provincesState, setProvincesState] = useState<
    ResourceState<Province[]>
  >({
    status: "idle",
  });
  const [municipalitiesState, setMunicipalitiesState] = useState<
    ResourceState<Municipality[]>
  >({ status: "idle" });

  const isResolvingRef = useRef(false);

  const loadCountries = useCallback(async () => {
    setCountriesState({ status: "loading" });
    try {
      const result = await countryApi.getAllCountries(langCode.toUpperCase());
      if (!result.data.success) {
        setCountriesState({
          status: "error",
          message: getErrorMessage(result.data.error),
        });
        return;
      }
      const data = result.data.data;
      setCountriesState({ status: "success", data });
    } catch {
      setCountriesState({
        status: "error",
        message: t("edit.errors.countryLoadFailed"),
      });
    }
  }, [t]);

  const loadProvinces = useCallback(
    async (countryId: number | null) => {
      if (!countryId) {
        setProvincesState({ status: "idle" });
        return;
      }
      setProvincesState({ status: "loading" });
      try {
        const result = await provinceApi.getAllProvincesByCountry(countryId);
        if (!result.data.success) {
          setProvincesState({
            status: "error",
            message: getErrorMessage(result.data.error),
          });
          return;
        }
        const data = result.data.data;
        setProvincesState({ status: "success", data });
      } catch {
        setProvincesState({
          status: "error",
          message: t("edit.errors.provinceLoadFailed"),
        });
      }
    },
    [t],
  );

  const loadMunicipalities = useCallback(
    async (provinceId: number | null) => {
      if (!provinceId) {
        setMunicipalitiesState({ status: "idle" });
        return;
      }
      setMunicipalitiesState({ status: "loading" });
      try {
        const result =
          await municipalityApi.getAllMunicipalitiesByProvince(provinceId);
        if (!result.data.success) {
          setMunicipalitiesState({
            status: "error",
            message: getErrorMessage(result.data.error),
          });
          return;
        }
        const data = result.data.data;

        setMunicipalitiesState({ status: "success", data });
      } catch {
        setMunicipalitiesState({
          status: "error",
          message: t("edit.errors.municipalityLoadFailed"),
        });
      }
    },
    [t],
  );

  // ── Prefill resolution — runs on mount, can be re-invoked via retry() ────
  const loadPrefillData = useCallback(async () => {
    if (isResolvingRef.current) return;
    isResolvingRef.current = true;
    setPrefillState({ status: "loading" });

    try {
      const result = await profileService.getProfile();
      if (!result.data.success) {
        setPrefillState({
          status: "error",
          message: getErrorMessage(result.data.error),
        });
        return;
      }
      const profile = result.data.data;

      loadCountries(); // Start loading countries in parallel — user likely doesn't want to wait for this after prefill resolves

      setPrefillState({
        status: "success",
        data: {
          firstName: profile.firstName,
          lastName: profile.lastName,
          companyName: profile.companyName,
          phone: profile.phone,
          website: profile.website,
          addressLine1: profile.addressLine1,
          addressLine2: profile.addressLine2,
          countryId: profile.country?.countryId ?? null,
          provinceId: profile.province?.provinceId ?? null,
          municipalityId: profile.municipality?.municipalityId ?? null,
          postalCode: profile.postalCode,
          languageId: profile.languageId,
        },
      });

      if (profile.country) {
        loadProvinces(profile.country.countryId);
      }
      if (profile.province) {
        loadMunicipalities(profile.province.provinceId);
      }
    } catch {
      setPrefillState({
        status: "error",
        message: t("edit.errors.profileLoadFailed"),
      });
    } finally {
      isResolvingRef.current = false;
    }
  }, [loadCountries, loadProvinces, loadMunicipalities]);

  useEffect(() => {
    loadPrefillData();
  }, [loadPrefillData]);

  const onCountryChange = useCallback(
    (countryId: number | null) => {
      setMunicipalitiesState({ status: "idle" });
      loadProvinces(countryId);
    },
    [loadProvinces],
  );

  const onProvinceChange = useCallback(
    (provinceId: number | null) => {
      loadMunicipalities(provinceId);
    },
    [loadMunicipalities],
  );

  // ── Submission ────────────────────────────────────────────────────────────

  const submit = (values: FormValues) => {
    dispatch(profileEditThunk({ values, t }));
  };

  // Navigate on success — equivalent to BlocListener reacting to success
  useEffect(() => {
    if (profileEditState.status === "success") {
      navigate("/account/profile");
    }
  }, [profileEditState.status, navigate]);

  const cancel = () => {
    navigate("/account/profile");
  };

  // Reset slice on unmount so stale state never leaks back
  useEffect(() => {
    return () => {
      dispatch(resetProfileEdit());
    };
  }, [dispatch]);

  return {
    prefillState,
    retryPrefill: loadPrefillData,
    countriesState,
    retryCountries: loadCountries,
    provincesState,
    municipalitiesState,
    onCountryChange,
    onProvinceChange,
    profileEditState,
    submit,
    cancel,
  };
}
