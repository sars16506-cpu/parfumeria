import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../images/logo.svg";
import profile from "../../images/profile.svg";
import shop from "../../images/shop.svg";
import "./Header.css";
import Modal from "../../ui/Modal/Modal";
import { useTranslation } from "react-i18next";

function Header() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const { t, i18n } = useTranslation();

  // Tilni localStorage dan olish yoki default 'ru'
  const [lang, setLang] = useState(() => {
    return localStorage.getItem("lang") || i18n.language || "ru";
  });

  // Til o'zgarganda i18n va localStorage ni yangilash
  useEffect(() => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  }, [lang, i18n]);

  // Scroll bo'lganda headerni berkitish/ko'rsatish
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setVisible(currentScrollY < lastScrollY.current || currentScrollY < 50);
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Menu ochiqligida scrollni muzlatish
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);
  const [open, setOpen] = useState(false);

  // Savatga o'tishdan oldin loginni tekshirish (Yangi koddagi logika)
  function handleNavigate() {
    const phone = localStorage.getItem("pv_phone") || "";
    const verified = localStorage.getItem("pv_verified") === "true";

    if (verified && phone) {
      navigate("/basket");
      closeMenu();
    } else {
      setOpen(true);
    }
  }

  return (
    <>
      <Modal open={open} onClose={() => setOpen(false)} />
      <header
        className="head"
        style={{
          transform: visible ? "translateY(0)" : "translateY(-100%)",
          transition: "transform 0.3s ease",
        }}
      >
        <div className="container">
          <div className="head__main">
            <div className="head__top">
              <Link className="head__logo" to="/">
                <img src={logo} alt="logo" />
              </Link>

              {/* Desktop Menu */}
              <ul className="head__list">
                <li className="head__item">
                  <Link className="head__link" to="/products">
                    {t("header.catalog")}
                  </Link>
                </li>
                <li className="head__item">
                  <a className="head__link" href="/#new">
                    {t("header.new")}
                  </a>
                </li>
                <li className="head__item">
                  <a className="head__link" href="/#foot">
                    {t("header.brands")}
                  </a>
                </li>
              </ul>

              <div className="head-top__inner">
                <div className="header-actins">
                  <div className="lang-wrap" role="group">
                    {["en", "uz", "ru"].map((l) => (
                      <button
                        key={l}
                        className={"lang-btn" + (lang === l ? " active" : "")}
                        onClick={() => setLang(l)}
                        type="button"
                      >
                        {l.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <button className="head-top__btns" onClick={() => setOpen(true)}>
                  <img src={profile} alt="profile" />
                </button>

                <button className="head-top__btns" onClick={handleNavigate}>
                  <img src={shop} alt="cart" />
                </button>
              </div>

              <button
                className={`head__burger ${menuOpen ? "open" : ""}`}
                onClick={() => setMenuOpen((o) => !o)}
                aria-label="Menu"
              >
                <span />
                <span />
                <span />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <nav className={`head__drawer ${menuOpen ? "open" : ""}`}>
        <button className="head__drawer-close" onClick={closeMenu}>
          &times;
        </button>

        <ul className="head__list">
          <li className="head__item">
            <Link className="head__link" to="/products" onClick={closeMenu}>
              {t("header.catalog")}
            </Link>
          </li>
          <li className="head__item">
            <a className="head__link" href="/#foot" onClick={closeMenu}>
              {t("header.brands")}
            </a>
          </li>
          <li className="head__item">
            <a className="head__link" href="/#new" onClick={closeMenu}>
              {t("header.new")}
            </a>
          </li>
        </ul>

        <div className="head-top__inner">
          <div className="header-actins">
            <div className="lang-wrap" role="group">
              {["en", "uz", "ru"].map((l) => (
                <button
                  key={l}
                  className={"lang-btn" + (lang === l ? " active" : "")}
                  onClick={() => setLang(l)}
                  type="button"
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <button
            className="head-top__btns"
            onClick={() => {
              setOpen(true);
              closeMenu();
            }}
          >
            <img src={profile} alt="profile" />
          </button>

          <button className="head-top__btns" onClick={handleNavigate}>
            <img src={shop} alt="cart" />
          </button>
        </div>
      </nav>
    </>
  );
}

export default Header;