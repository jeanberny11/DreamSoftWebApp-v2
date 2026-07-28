// InvoicesSection — Invoices list page
//
// Fetches invoices via invoices.store (optionally solution-scoped through the
// ?solutionId= query param, which the "View Invoices" button on a subscription
// card deep-links into). Status/search/date-range filters are applied
// client-side over the fetched list. The solution dropdown itself updates the
// URL so the scope stays shareable/bookmarkable, matching the rest of the app's
// state-driven navigation pattern.

import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getFeatureIcon } from "@/apps/landingapp/features/home/utils/featureIconMap";
import { formatCurrency, formatDate } from "@/shared/utils/formatters";
import { useInvoices } from "../hooks/useInvoices";
import { useSubscriptions } from "../hooks/useSubscriptions";
import {
  getInvoiceStatusVariant,
  INVOICE_STATUS,
  type InvoiceDto,
} from "../types/invoices.types";
import "../styles/invoices.css";

type StatusFilter = "all" | "paid" | "unpaid" | "failed" | "refunded";

const STATUS_FILTERS: StatusFilter[] = ["all", "paid", "unpaid", "failed", "refunded"];

const STATUS_ICON: Record<string, string> = {
  [INVOICE_STATUS.PAID]: "check_circle",
  [INVOICE_STATUS.UNPAID]: "schedule",
  [INVOICE_STATUS.FAILED]: "error",
  [INVOICE_STATUS.REFUNDED]: "undo",
};

export function InvoicesSection() {
  const { t } = useTranslation("subscriptions");
  const [searchParams, setSearchParams] = useSearchParams();
  const subscriptionsState = useSubscriptions();

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // dateFrom/dateTo are threaded into the hook so invoices.store can hit the
  // real GET /invoice/by-date-range endpoint instead of filtering client-side
  // (only falls back to a client-side pass when a solution filter is also
  // active at the same time — see invoices.store.ts).
  const invoicesState = useInvoices(dateFrom || undefined, dateTo || undefined);

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

  const clearClientFilters = () => {
    setStatusFilter("all");
    setSearch("");
    setDateFrom("");
    setDateTo("");
  };

  if (invoicesState.status === "idle" || invoicesState.status === "loading") {
    return (
      <div className="tcp-inv-page">
        <div className="tcp-inv-loading">
          <div className="tcp-inv-spinner" role="status" aria-label={t("invoices.loading")} />
          <p>{t("invoices.loading")}</p>
        </div>
      </div>
    );
  }

  if (invoicesState.status === "error") {
    return (
      <div className="tcp-inv-page">
        <div className="tcp-inv-error">
          <span className="material-symbols-outlined" style={{ fontSize: 40, color: "var(--color-error-500)" }}>
            error
          </span>
          <p className="tcp-inv-error__title">{t("invoices.errorTitle")}</p>
          <p>{invoicesState.message || t("invoices.errorMessage")}</p>
          <button
            type="button"
            className="tcp-inv-error__retry"
            onClick={() => invoicesState.refetch()}
          >
            {t("invoices.retry")}
          </button>
        </div>
      </div>
    );
  }

  const rawInvoices = invoicesState.data;

  const filtered = rawInvoices.filter((inv) => {
    if (statusFilter !== "all" && inv.status.toLowerCase() !== statusFilter) return false;
    if (search && !(inv.invoiceNumber ?? "").toLowerCase().includes(search.toLowerCase())) return false;
    if (dateFrom && new Date(inv.dueDate) < new Date(dateFrom)) return false;
    if (dateTo && new Date(inv.dueDate) > new Date(dateTo)) return false;
    return true;
  });

  const hasClientFilters = statusFilter !== "all" || search !== "" || dateFrom !== "" || dateTo !== "";
  const isTrueEmpty = rawInvoices.length === 0 && !hasClientFilters;
  const isFilteredEmpty = filtered.length === 0 && !isTrueEmpty;

  const currency = rawInvoices[0]?.currency ?? "USD";
  const totalPaid = rawInvoices
    .filter((i) => i.status.toLowerCase() === INVOICE_STATUS.PAID)
    .reduce((sum, i) => sum + i.amount, 0);
  const outstandingCount = rawInvoices.filter(
    (i) => i.status.toLowerCase() === INVOICE_STATUS.UNPAID || i.status.toLowerCase() === INVOICE_STATUS.FAILED,
  ).length;

  return (
    <div className="tcp-inv-page">
      {/* Header */}
      <div className="tcp-inv-header">
        <div>
          <h1 className="tcp-inv-header__title">{t("invoices.title")}</h1>
          <p className="tcp-inv-header__subtitle">{t("invoices.subtitle")}</p>
        </div>
        <select
          className="tcp-inv-solution-select"
          value={invoicesState.solutionId ? String(invoicesState.solutionId) : ""}
          onChange={(e) => handleSolutionChange(e.target.value)}
        >
          <option value="">{t("invoices.solutionFilterAll")}</option>
          {solutionOptions.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {isTrueEmpty ? (
        <div className="tcp-inv-empty">
          <div className="tcp-inv-empty__icon-wrap">
            <span className="material-symbols-outlined">receipt_long</span>
          </div>
          <h3 className="tcp-inv-empty__title">{t("invoices.emptyTrue.title")}</h3>
          <p className="tcp-inv-empty__description">{t("invoices.emptyTrue.description")}</p>
        </div>
      ) : (
        <>
          {/* Stats strip */}
          <div className="tcp-inv-stats">
            <div className="tcp-inv-stat">
              <div>
                <p className="tcp-inv-stat__label">{t("invoices.stats.totalInvoices")}</p>
                <p className="tcp-inv-stat__value">{rawInvoices.length}</p>
              </div>
              <div className="tcp-inv-stat__icon tcp-inv-stat__icon--primary">
                <span className="material-symbols-outlined">article</span>
              </div>
            </div>
            <div className="tcp-inv-stat">
              <div>
                <p className="tcp-inv-stat__label">{t("invoices.stats.totalPaid")}</p>
                <p className="tcp-inv-stat__value">{formatCurrency(totalPaid, currency)}</p>
              </div>
              <div className="tcp-inv-stat__icon tcp-inv-stat__icon--success">
                <span className="material-symbols-outlined">payments</span>
              </div>
            </div>
            <div className="tcp-inv-stat">
              <div>
                <p className="tcp-inv-stat__label">{t("invoices.stats.outstanding")}</p>
                <p className="tcp-inv-stat__value tcp-inv-stat__value--error">
                  {t("invoices.stats.outstandingCount", { count: outstandingCount })}
                </p>
              </div>
              <div className="tcp-inv-stat__icon tcp-inv-stat__icon--error">
                <span className="material-symbols-outlined">pending_actions</span>
              </div>
            </div>
          </div>

          {/* Filter bar */}
          <div className="tcp-inv-filterbar">
            <div className="tcp-inv-status-pills">
              {STATUS_FILTERS.map((f) => (
                <button
                  key={f}
                  type="button"
                  className={`tcp-inv-status-pill${statusFilter === f ? " tcp-inv-status-pill--active" : ""}`}
                  onClick={() => setStatusFilter(f)}
                >
                  {t(`invoices.filters.${f}`)}
                </button>
              ))}
            </div>
            <div className="tcp-inv-date-range">
              <input
                type="date"
                className="tcp-inv-date-input"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
              <span className="material-symbols-outlined" style={{ fontSize: 16, color: "var(--color-text-tertiary)" }}>
                arrow_forward
              </span>
              <input
                type="date"
                className="tcp-inv-date-input"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
            <input
              type="text"
              className="tcp-inv-search"
              placeholder={t("invoices.filters.searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {isFilteredEmpty ? (
            <div className="tcp-inv-empty">
              <div className="tcp-inv-empty__icon-wrap">
                <span className="material-symbols-outlined">search_off</span>
              </div>
              <h3 className="tcp-inv-empty__title">{t("invoices.emptyFiltered.title")}</h3>
              <p className="tcp-inv-empty__description">{t("invoices.emptyFiltered.description")}</p>
              <button type="button" className="tcp-inv-empty__clear" onClick={clearClientFilters}>
                {t("invoices.emptyFiltered.clearFilters")}
              </button>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="tcp-inv-table-wrap">
                <table className="tcp-inv-table">
                  <thead>
                    <tr>
                      <th>{t("invoices.table.planSolution")}</th>
                      <th>{t("invoices.table.invoiceNumber")}</th>
                      <th>{t("invoices.table.amount")}</th>
                      <th>{t("invoices.table.status")}</th>
                      <th>{t("invoices.table.date")}</th>
                      <th></th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((inv) => (
                      <InvoiceRows
                        key={inv.id}
                        invoice={inv}
                        t={t}
                        expanded={expandedId === inv.id}
                        onToggleExpand={() => setExpandedId(expandedId === inv.id ? null : inv.id)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="tcp-inv-cards">
                {filtered.map((inv) => (
                  <InvoiceCard key={inv.id} invoice={inv} t={t} />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

// ── Desktop row (+ expandable attempt history) ──────────────────────────────

interface RowProps {
  invoice: InvoiceDto;
  t: (key: string, options?: Record<string, unknown>) => string;
  expanded: boolean;
  onToggleExpand: () => void;
}

function InvoiceRows({ invoice, t, expanded, onToggleExpand }: RowProps) {
  const variant = getInvoiceStatusVariant(invoice.status);
  const statusIcon = STATUS_ICON[invoice.status.toLowerCase()] ?? "info";
  const isFailed = invoice.status.toLowerCase() === INVOICE_STATUS.FAILED;
  const hasAttempts = invoice.payments.length > 0;

  return (
    <>
      <tr className={isFailed ? "tcp-inv-row--failed" : undefined}>
        <td>
          <p className="tcp-inv-row-plan">{invoice.planName}</p>
          <span className="tcp-inv-row-solution">
            <FontAwesomeIcon icon={getFeatureIcon(invoice.solutionIcon)} />
            {invoice.solutionName}
          </span>
        </td>
        <td>{invoice.invoiceNumber ?? `#${invoice.id}`}</td>
        <td>{formatCurrency(invoice.amount, invoice.currency)}</td>
        <td>
          <span className={`tcp-inv-badge tcp-inv-badge--${variant}`}>
            <span className="material-symbols-outlined">{statusIcon}</span>
            {t(`invoices.status.${invoice.status.toLowerCase()}`)}
          </span>
        </td>
        <td>
          {invoice.status.toLowerCase() === INVOICE_STATUS.PAID && invoice.paidAt
            ? t("invoices.table.paidOn", { date: formatDate(invoice.paidAt) })
            : t("invoices.table.dueOn", { date: formatDate(invoice.dueDate) })}
        </td>
        <td>
          {hasAttempts && (
            <span className="tcp-inv-attempts-chip">
              {t("invoices.table.attemptsCount", { count: invoice.payments.length })}
            </span>
          )}
        </td>
        <td>
          <div className="tcp-inv-row-actions">
            <button
              type="button"
              className="tcp-inv-icon-btn"
              disabled={!invoice.invoicePdfUrl}
              title={t("invoices.table.downloadAction")}
              onClick={() => invoice.invoicePdfUrl && window.open(invoice.invoicePdfUrl, "_blank", "noopener")}
            >
              <span className="material-symbols-outlined">picture_as_pdf</span>
            </button>
            <button
              type="button"
              className={`tcp-inv-icon-btn${expanded ? " tcp-inv-icon-btn--active" : ""}`}
              disabled={!hasAttempts}
              title={t("invoices.table.viewAction")}
              onClick={onToggleExpand}
            >
              <span className="material-symbols-outlined">
                {expanded ? "expand_less" : "expand_more"}
              </span>
            </button>
          </div>
        </td>
      </tr>

      {expanded && hasAttempts && (
        <tr className="tcp-inv-expand-row">
          <td colSpan={7}>
            <div className="tcp-inv-expand-inner">
              <div className="tcp-inv-expand-heading">
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>history</span>
                {t("invoices.attemptHistory.heading")}
              </div>
              <table className="tcp-inv-attempt-table">
                <thead>
                  <tr>
                    <th>{t("invoices.attemptHistory.date")}</th>
                    <th>{t("invoices.attemptHistory.amount")}</th>
                    <th>{t("invoices.attemptHistory.status")}</th>
                    <th>{t("invoices.attemptHistory.failureReason")}</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.payments.map((p) => (
                    <tr key={p.id}>
                      <td>{formatDate(p.paymentDate)}</td>
                      <td>{formatCurrency(p.amount, p.currency)}</td>
                      <td>{t(`invoices.status.${p.status.toLowerCase()}`)}</td>
                      <td className="tcp-inv-attempt-failure">{p.failureReason ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ── Mobile card ──────────────────────────────────────────────────────────────

function InvoiceCard({ invoice, t }: { invoice: InvoiceDto; t: (key: string, options?: Record<string, unknown>) => string }) {
  const variant = getInvoiceStatusVariant(invoice.status);
  const isFailed = invoice.status.toLowerCase() === INVOICE_STATUS.FAILED;

  return (
    <div className={`tcp-inv-card${isFailed ? " tcp-inv-card--failed" : ""}`}>
      <div className="tcp-inv-card__top">
        <div>
          <p className="tcp-inv-row-plan">{invoice.planName}</p>
          <span className="tcp-inv-row-solution">
            <FontAwesomeIcon icon={getFeatureIcon(invoice.solutionIcon)} />
            {invoice.solutionName}
          </span>
        </div>
        <span className={`tcp-inv-badge tcp-inv-badge--${variant}`}>
          {t(`invoices.status.${invoice.status.toLowerCase()}`)}
        </span>
      </div>
      <div className="tcp-inv-card__footer">
        <div>
          <p className="tcp-inv-card__meta">{invoice.invoiceNumber ?? `#${invoice.id}`}</p>
          <p className="tcp-inv-card__amount">{formatCurrency(invoice.amount, invoice.currency)}</p>
        </div>
        <button
          type="button"
          className="tcp-inv-icon-btn"
          disabled={!invoice.invoicePdfUrl}
          onClick={() => invoice.invoicePdfUrl && window.open(invoice.invoicePdfUrl, "_blank", "noopener")}
        >
          <span className="material-symbols-outlined">picture_as_pdf</span>
        </button>
      </div>
    </div>
  );
}
