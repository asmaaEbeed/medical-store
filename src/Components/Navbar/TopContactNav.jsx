import React from "react";
import { Container } from "react-bootstrap";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTranslation } from "react-i18next";

const TopContactNav = () => {
  const { toggleLanguage, currentLang, isRTL } = useLanguage();
  const { t } = useTranslation();

  return (
    <div className="bg-warning-400 ">
      <Container className="d-flex justify-content-between p-1">
        <section className="d-lg-flex align-items-center text-white fw-bold d-none ">
          <p className="mb-0 text-uppercase fs-xs px-2">
            <i className="bx bx-envelope p-1"></i>careplus@example.com
          </p>
          <p className="mb-0 text-uppercase fs-xs px-2">
            <i className="bx bx-mobile-alt p-1"></i>001 23 456 78 910
            {/*  */}
          </p>
          <p className="mb-0 text-uppercase fs-xs px-2">
            <i className="bx bx-location-plus"></i>22nd St cairo
          </p>
        </section>
        <section className="text-white fw-bold">
          <button
            onClick={toggleLanguage}
            className="border-0 bg-transparent text-white fw-bold mx-md-4 mx-3"
          >
            {currentLang === "en" ? "عربي" : "English"}
          </button>
        </section>
      </Container>
    </div>
  );
};

export default TopContactNav;
