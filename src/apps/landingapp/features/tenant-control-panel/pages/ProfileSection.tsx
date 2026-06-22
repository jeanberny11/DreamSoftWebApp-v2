// ProfileSection — Profile view page (read-only)
//
// Fetches the tenant's profile via profile.store (Zustand) and renders the
// hero card (avatar, name, status, email, member-since/last-update footer),
// plus Business and Location info cards. "Edit Profile" navigates to
// /account/profile/edit — this page never edits anything directly.

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useProfileStore } from "../stores/profile.store";
import { useTenantAuthStore } from "@/apps/landingapp/common/tenant_auth.store";
import { formatMonthYear, formatRelativeTime } from "@/shared/utils/formatters";
import neutralProfilePicture from "@/assets/images/neutral_profile_picture.png";
import "../styles/profile.css";

export function ProfileSection() {
  const { t } = useTranslation("profile");
  const navigate = useNavigate();

  const profileState = useProfileStore((s) => s);
  const onboardingCompleted = useTenantAuthStore(
    (s) => s.session?.onboardingCompleted,
  );

  useEffect(() => {
    if (profileState.status === "idle") {
      profileState.fetchProfile();
    }
  }, [profileState]);

  if (profileState.status === "idle" || profileState.status === "loading") {
    return (
      <div className="tcp-profile-loading">
        <div
          className="tcp-profile-spinner"
          role="status"
          aria-label={t("view.loading")}
        />
        <p>{t("view.loading")}</p>
      </div>
    );
  }

  if (profileState.status === "error") {
    return (
      <div className="tcp-profile-error">
        <span
          className="material-symbols-outlined"
          style={{ fontSize: 40, color: "var(--color-error-500)" }}
        >
          error
        </span>
        <p className="tcp-profile-error__title">{t("view.errorTitle")}</p>
        <p>{profileState.message || t("view.errorMessage")}</p>
        <button
          type="button"
          className="tcp-profile-error__retry"
          onClick={() => profileState.fetchProfile()}
        >
          {t("view.retry")}
        </button>
      </div>
    );
  }

  const profile = profileState.data;

  const fullName = `${profile.firstName} ${profile.lastName}`.trim();
  const avatarSrc = profile.logoUrl || neutralProfilePicture;
  const isActiveStatus = profile.tenantStatus.toLowerCase() === "active";

  const addressParts = [
    profile.addressLine1,
    profile.addressLine2,
    profile.municipality?.name,
    profile.province?.name,
    profile.postalCode,
    profile.country?.name,
  ].filter((part) => !!part && part.trim() !== "");

  const renderField = (
    label: string,
    value: string | null | undefined,
    isLink = false,
  ) => (
    <div className="tcp-profile-field">
      <label className="tcp-profile-field__label">{label}</label>
      {value ? (
        <p
          className={`tcp-profile-field__value ${isLink ? "tcp-profile-field__value--link" : ""}`}
        >
          {value}
        </p>
      ) : (
        <p className="tcp-profile-field__value tcp-profile-field__value--empty">
          {t("view.empty")}
        </p>
      )}
    </div>
  );

  return (
    <div className="tcp-profile-page">
      {/* Page Header */}
      <div className="tcp-profile-header">
        <h1 className="tcp-profile-header__title">{t("view.title")}</h1>
        <button
          type="button"
          className="tcp-profile-edit-btn"
          onClick={() => navigate("/account/profile/edit")}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
            edit
          </span>
          <span>{t("view.editButton")}</span>
        </button>
      </div>

      {/* Hero Card */}
      <div className="tcp-profile-hero">
        <div className="tcp-profile-hero__banner" />
        <div className="tcp-profile-hero__body">
          <div className="tcp-profile-hero__avatar-wrap">
            <img
              src={avatarSrc}
              alt={fullName}
              className="tcp-profile-hero__avatar"
            />
          </div>

          <div className="tcp-profile-hero__identity">
            <h2 className="tcp-profile-hero__name">{fullName}</h2>
            <span
              className={`tcp-profile-status-badge ${isActiveStatus ? "" : "tcp-profile-status-badge--inactive"}`}
            >
              <span className="tcp-profile-status-badge__dot" />
              {profile.tenantStatus}
            </span>
          </div>

          <div className="tcp-profile-hero__email-row">
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 18 }}
            >
              mail
            </span>
            <span>{profile.email}</span>
            {/* Inline email editing not yet implemented — handled from /account/profile/edit later */}
            <button
              type="button"
              className="tcp-profile-hero__email-edit"
              aria-hidden="true"
              tabIndex={-1}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 16 }}
              >
                edit
              </span>
            </button>
          </div>

          <div className="tcp-profile-hero__footer">
            <div className="tcp-profile-hero__footer-item">
              <span className="tcp-profile-hero__footer-label">
                {t("view.memberSince")}
              </span>
              <span className="tcp-profile-hero__footer-value">
                {formatMonthYear(profile.createdAt)}
              </span>
            </div>
            <div className="tcp-profile-hero__footer-divider" />
            <div className="tcp-profile-hero__footer-item">
              <span className="tcp-profile-hero__footer-label">
                {t("view.lastUpdate")}
              </span>
              <span className="tcp-profile-hero__footer-value">
                {formatRelativeTime(profile.updatedAt)}
              </span>
            </div>
            {onboardingCompleted && (
              <>
                <div className="tcp-profile-hero__footer-divider" />
                <span className="tcp-profile-success-badge">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 16 }}
                  >
                    check_circle
                  </span>
                  {t("view.onboardingComplete")}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Info Cards Row */}
      <div className="tcp-profile-cards-row">
        {/* Business Card */}
        <div className="tcp-profile-card">
          <div className="tcp-profile-card__header">
            <div className="tcp-profile-card__icon">
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 20 }}
              >
                apartment
              </span>
            </div>
            <h3 className="tcp-profile-card__title">
              {t("view.sections.business")}
            </h3>
          </div>
          <div className="tcp-profile-card__body">
            {renderField(t("view.fields.company"), profile.companyName)}
            {renderField(t("view.fields.phone"), profile.phone)}
            {renderField(t("view.fields.website"), profile.website, true)}
          </div>
        </div>

        {/* Location Card */}
        <div className="tcp-profile-card">
          <div className="tcp-profile-card__header">
            <div className="tcp-profile-card__icon">
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 20 }}
              >
                location_on
              </span>
            </div>
            <h3 className="tcp-profile-card__title">
              {t("view.sections.location")}
            </h3>
          </div>
          <div className="tcp-profile-card__body">
            {addressParts.length > 0 ? (
              <div className="tcp-profile-address-block">
                <div className="tcp-profile-address-block__icon">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 20 }}
                  >
                    map
                  </span>
                </div>
                <p className="tcp-profile-address-block__text">
                  {addressParts.map((part, i) => (
                    <span key={i}>
                      {part}
                      {i < addressParts.length - 1 && <br />}
                    </span>
                  ))}
                </p>
              </div>
            ) : (
              <p className="tcp-profile-field__value tcp-profile-field__value--empty">
                {t("view.empty")}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
