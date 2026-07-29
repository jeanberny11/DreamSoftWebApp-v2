// PaymentsSection — Payments History page
//
// Flat, chronological ledger of every payment attempt (successful and
// failed) across the tenant's subscriptions. Mirrors InvoicesSection's
// data-fetching pattern (optional ?solutionId= scope + client-side
// status/date filters), but without row expansion — each row here already
// IS a single payment attempt.

import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getFeatureIcon } from "@/apps/landingapp/features/home/utils/featureIconMap";
import { formatCurrency, formatDate } from "@/shared/utils/formatters";
import { usePayments } from "../hooks/usePayments";
import { useSubscriptions } from "../hooks/useSubscriptions";
import {
  getPaymentStatusVariant,
  PAYMENT_STATUS,
  type PaymentHistoryDto,
} from "../types/payments.types";
import "../styles/payments.css";

type StatusFilter = "all" | "successful" | "failed";

const STATUS_FILTERS: StatusFilter[] = ["all", "successful", "failed"];

export function PaymentsSection() {
  const { t } = useTranslation("subscriptions");
  const [searchParams, setSearchParams] = useSearchParams();
  const subscriptionsState = useSubscriptions();

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // dateFrom/dateTo are threaded into the hook so payments.store can hit the
  // real GET /payment/by-date-range endpoint instead of filtering client-side
  // (only falls back to a client-side pass when a solution filter is also
  // active at the same time — see payments.store.ts).
  const paymentsState = usePayments(dateFrom || undefined, dateTo || undefined);

  const solutionOptions = useMemo(() => {
    if (subscriptionsState.status !== "success") return [];
    const map = new Map<number, { id: number; name: string }>();
    subscriptionsState.data.forEach((s) => {
      if (!map.has(s.solutionId)) map.set(s.solutionId, { id: s.solutionId, name: s.solutionName });
    });
    return Array.from(map.values());
  }, [subscriptionsState]);

  const handleSolutionChange = (value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set("solutionId", value);
    else next.delete("solutionId");
    setSearchParams(next);
  };

  if (paymentsState.status === "idle" || paymentsState.status === "loading") {
    return (
      <div className="tcp-pay-page">
        <div className="tcp-pay-loading">
          <div className="tcp-pay-spinner" role="status" aria-label={t("payments.loading")} />
          <p>{t("payments.loading")}</p>
        </div>
      </div>
    );
  }

  if (paymentsState.status === "error") {
    return (
      <div className="tcp-pay-page">
        <div className="tcp-pay-error">
          <span className="material-symbols-outlined" style={{ fontSize: 40, color: "var(--color-error-500)" }}>
            error
          </span>
          <p className="tcp-pay-error__title">{t("payments.errorTitle")}</p>
          <p>{paymentsState.message || t("payments.errorMessage")}</p>
          <button
            type="button"
            className="tcp-pay-error__retry"
            onClick={() => paymentsState.refetch()}
          >
            {t("payments.retry")}
          </button>
        </div>
      </div>
    );
  }

  const rawPayments = paymentsState.data;

  const filtered = rawPayments.filter((p) => {
    if (statusFilter === "successful" && p.status.toLowerCase() !== PAYMENT_STATUS.PAID) return false;
    if (statusFilter === "failed" && p.status.toLowerCase() !== PAYMENT_STATUS.FAILED) return false;
    if (dateFrom && new Date(p.paymentDate) < new Date(dateFrom)) return false;
    if (dateTo && new Date(p.paymentDate) > new Date(dateTo)) return false;
    return true;
  });

  const hasClientFilters = statusFilter !== "all" || dateFrom !== "" || dateTo !== "";
  const isTrueEmpty = rawPayments.length === 0 && !hasClientFilters;

  const currency = rawPayments[0]?.currency ?? "USD";
  const totalPaid = rawPayments
    .filter((p) => p.status.toLowerCase() === PAYMENT_STATUS.PAID)
    .reduce((sum, p) => sum + p.amount, 0);
  const failedCount = rawPayments.filter((p) => p.status.toLowerCase() === PAYMENT_STATUS.FAILED).length;
  const successRate = rawPayments.length > 0
    ? Math.round((rawPayments.filter((p) => p.status.toLowerCase() === PAYMENT_STATUS.PAID).length / rawPayments.length) * 100)
    : 0;

  return (
    <div className="tcp-pay-page">
      {/* Header */}
      <div className="tcp-pay-header">
        <div>
          <h1 className="tcp-pay-header__title">{t("payments.title")}</h1>
          <p className="tcp-pay-header__subtitle">{t("payments.subtitle")}</p>
        </div>
        <select
          className="tcp-pay-solution-select"
          value={paymentsState.solutionId ? String(paymentsState.solutionId) : ""}
          onChange={(e) => handleSolutionChange(e.target.value)}
        >
          <option value="">{t("payments.solutionFilterAll")}</option>
          {solutionOptions.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {isTrueEmpty ? (
        <div className="tcp-pay-empty">
          <div className="tcp-pay-empty__icon-wrap">
            <span className="material-symbols-outlined">payments</span>
          </div>
          <h3 className="tcp-pay-empty__title">{t("payments.empty.title")}</h3>
          <p className="tcp-pay-empty__description">{t("payments.empty.description")}</p>
        </div>
      ) : (
        <>
          {/* Stats strip */}
          <div className="tcp-pay-stats">
            <div className="tcp-pay-stat">
              <div className="tcp-pay-stat__icon tcp-pay-stat__icon--primary">
                <span className="material-symbols-outlined">account_balance_wallet</span>
              </div>
              <div>
                <p className="tcp-pay-stat__label">{t("payments.stats.totalPaid")}</p>
                <p className="tcp-pay-stat__value">{formatCurrency(totalPaid, currency)}</p>
              </div>
            </div>
            <div className="tcp-pay-stat">
              <div className="tcp-pay-stat__icon tcp-pay-stat__icon--error">
                <span className="material-symbols-outlined">error</span>
              </div>
              <div>
                <p className="tcp-pay-stat__label">{t("payments.stats.failedAttempts")}</p>
                <p className="tcp-pay-stat__value">{failedCount}</p>
              </div>
            </div>
            <div className="tcp-pay-stat">
              <div className="tcp-pay-stat__icon tcp-pay-stat__icon--success">
                <span className="material-symbols-outlined">trending_up</span>
              </div>
              <div>
                <p className="tcp-pay-stat__label">{t("payments.stats.successRate")}</p>
                <p className="tcp-pay-stat__value">{successRate}%</p>
              </div>
            </div>
          </div>

          {/* Filter bar */}
          <div className="tcp-pay-filterbar">
            <div className="tcp-pay-status-pills">
              {STATUS_FILTERS.map((f) => (
                <button
                  key={f}
                  type="button"
                  className={`tcp-pay-status-pill${statusFilter === f ? " tcp-pay-status-pill--active" : ""}`}
                  onClick={() => setStatusFilter(f)}
                >
                  {t(`payments.filters.${f}`)}
                </button>
              ))}
            </div>
            <div className="tcp-pay-date-range">
              <input
                type="date"
                className="tcp-pay-date-input"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
              <span className="material-symbols-outlined" style={{ fontSize: 16, color: "var(--color-text-tertiary)" }}>
                arrow_forward
              </span>
              <input
                type="date"
                className="tcp-pay-date-input"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
          </div>

          {/* Desktop table */}
          <div className="tcp-pay-table-wrap">
            <table className="tcp-pay-table">
              <thead>
                <tr>
                  <th>{t("payments.table.date")}</th>
                  <th>{t("payments.table.planSolution")}</th>
                  <th>{t("payments.table.invoice")}</th>
                  <th>{t("payments.table.amount")}</th>
                  <th>{t("payments.table.status")}</th>
                  <th>{t("payments.table.reference")}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <PaymentRow key={p.id} payment={p} t={t} />
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="tcp-pay-cards">
            {filtered.map((p) => (
              <PaymentCard key={p.id} payment={p} t={t} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── Desktop row ──────────────────────────────────────────────────────────────

interface RowProps {
  payment: PaymentHistoryDto;
  t: (key: string, options?: Record<string, unknown>) => string;
}

function PaymentRow({ payment, t }: RowProps) {
  const variant = getPaymentStatusVariant(payment.status);
  const isFailed = payment.status.toLowerCase() === PAYMENT_STATUS.FAILED;

  return (
    <tr className={isFailed ? "tcp-pay-row--failed" : undefined}>
      <td>{formatDate(payment.paymentDate)}</td>
      <td>
        <p className="tcp-pay-row-plan">{payment.planName}</p>
        <span className="tcp-pay-row-solution">
          <FontAwesomeIcon icon={getFeatureIcon(payment.solutionIcon)} />
          {payment.solutionName}
        </span>
      </td>
      <td>
        {payment.invoiceNumber ? (
          <Link className="tcp-pay-invoice-link" to={`/account/invoices?solutionId=${payment.solutionId}`}>
            #{payment.invoiceNumber}
          </Link>
        ) : (
          "—"
        )}
      </td>
      <td>{formatCurrency(payment.amount, payment.currency)}</td>
      <td>
        <span className={`tcp-pay-badge tcp-pay-badge--${variant}`}>
          {t(`payments.status.${payment.status.toLowerCase()}`)}
        </span>
        {isFailed && payment.failureReason && (
          <span className="tcp-pay-failure-reason">{payment.failureReason}</span>
        )}
      </td>
      <td>
        <span className="tcp-pay-reference">{payment.stripePaymentId ?? "—"}</span>
      </td>
    </tr>
  );
}

// ── Mobile card ──────────────────────────────────────────────────────────────

function PaymentCard({ payment, t }: RowProps) {
  const variant = getPaymentStatusVariant(payment.status);
  const isFailed = payment.status.toLowerCase() === PAYMENT_STATUS.FAILED;

  return (
    <div className={`tcp-pay-card${isFailed ? " tcp-pay-card--failed" : ""}`}>
      <div className="tcp-pay-card__top">
        <div>
          <p className="tcp-pay-row-plan">{payment.planName}</p>
          <span className="tcp-pay-row-solution">
            <FontAwesomeIcon icon={getFeatureIcon(payment.solutionIcon)} />
            {payment.solutionName}
          </span>
        </div>
        <div>
          <span className={`tcp-pay-badge tcp-pay-badge--${variant}`}>
            {t(`payments.status.${payment.status.toLowerCase()}`)}
          </span>
          {isFailed && payment.failureReason && (
            <span className="tcp-pay-failure-reason">{payment.failureReason}</span>
          )}
        </div>
      </div>
      <div className="tcp-pay-card__footer">
        <p className="tcp-pay-card__meta">{formatDate(payment.paymentDate)}</p>
        <p className="tcp-pay-card__amount">{formatCurrency(payment.amount, payment.currency)}</p>
      </div>
    </div>
  );
}
