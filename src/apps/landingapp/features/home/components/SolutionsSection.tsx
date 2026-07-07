import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { useSolutions } from "../hooks/useSolutions";
import "../styles/home_page.css";
import { getFeatureIcon } from "../utils/featureIconMap";


export function SolutionsSection() {
  const state = useSolutions();
  const { t } = useTranslation("landing");

  return (
    <section id="solutions" className="solutions-section">
      <div className="section-container">
        <div className="section-header">
          <p className="section-eyebrow">{t("solutions.badge")}</p>
          <h2 className="section-title">{t("solutions.title")}</h2>
          <p className="section-subtitle">{t("solutions.subtitle")}</p>
        </div>

        {(state.status === "idle" || state.status === "loading") && (
          <div className="solutions-grid">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="solutions-skeleton-card">
                <div className="solutions-skeleton-icon" />
                <div className="solutions-skeleton-title" />
                <div className="solutions-skeleton-text" />
              </div>
            ))}
          </div>
        )}

        {state.status === "error" && (
          <div className="section-error">
            <p className="section-error-text">{state.message}</p>
          </div>
        )}

        {state.status === "success" && (
          <div className="solutions-grid">
            {state.data.map((solution) => (
              <div key={solution.solutionId} className="solution-card">
                <div
                  className="solution-card-icon"
                >
                  <FontAwesomeIcon
                    icon={getFeatureIcon(solution.icon)}
                    className="text-xl"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="solution-card-title">{solution.name}</h3>
                <p className="solution-card-desc">{solution.description}</p>
                <Link to={`/solutions/${solution.code}`} className="solution-card-link">
                  {t("solutions.learnMore")}
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    className="text-xs"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
