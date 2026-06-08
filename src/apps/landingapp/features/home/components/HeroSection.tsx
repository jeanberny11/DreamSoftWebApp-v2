// HeroSection — main hero for the landing HomePage

import { Link } from "react-router-dom";
import "../styles/home_page.css";
import { useTranslation } from "react-i18next";

export function HeroSection() {
  const { t } = useTranslation("landing");
  return (
    <section id="hero" className="hero">
      <div className="hero-inner">
        <div className="hero-content">
          <h1 className="hero-title">
            {t("hero.headline1")}{" "}
            <span className="hero-title-gradient"> {t("hero.headline2")}</span>
            {t("hero.headline3")}
          </h1>
          <p className="hero-subtitle">{t("hero.subtext")}</p>
          <div className="hero-actions">
            <Link to="/register" className="hero-btn-primary">
              {t("hero.ctaPrimary")}
            </Link>
            <button
              onClick={() =>
                document
                  .querySelector("#features")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="hero-btn-secondary"
            >
              {t("hero.ctaSecondary")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
