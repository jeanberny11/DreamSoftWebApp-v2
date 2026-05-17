/**
 * LanguageSwitcher component
 *
 * Dropdown that lists API-supplied languages and switches the active i18n language.
 * Falls back to static ['es', 'en'] list if the API is unavailable.
 * The selected value displays a globe icon + language code (e.g. "EN"),
 * while the dropdown list still shows full language names.
 *
 * @example
 * <LanguageSwitcher />
 */

import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../store/language.store";
import { Dropdown } from "primereact/dropdown";
import type { Language } from "../types/language.types";

/** Globe SVG icon — universally recognised as a language/region control */
function GlobeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-gray-500 shrink-0"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20A14.5 14.5 0 0 0 12 2" />
      <path d="M2 12h20" />
    </svg>
  );
}

/** Renders globe icon + uppercase language code in the trigger button */
function SelectedLanguageTemplate(option: Language | null) {
  if (!option) return null;
  return (
    <span className="flex items-center gap-1.5">
      <GlobeIcon />
      <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
        {option.code.toUpperCase()}
      </span>
    </span>
  );
}

export function LanguageSwitcher() {
  const { t } = useTranslation("common");
  const { languages, currentLanguage, changeLanguage, isLoading } =
    useLanguageStore();

  return (
    <div className="relative flex items-center">
      <Dropdown
        value={currentLanguage}
        onChange={(e: { value: Language }) => changeLanguage(e.value)}
        options={languages}
        optionLabel="name"
        placeholder={t("language.select")}
        valueTemplate={SelectedLanguageTemplate}
        className="
          appearance-none rounded-md border border-gray-200 bg-white
          py-1.5 pl-3 pr-7 text-sm font-medium text-gray-700
          transition-colors hover:border-gray-300
          focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500
          cursor-pointer
        "
        checkmark={true}
        highlightOnSelect={false}
        loading={isLoading}
      />
    </div>
  );
}
