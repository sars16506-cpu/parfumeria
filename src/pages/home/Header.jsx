import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../../images/logo4.png";
import profile from "../../images/profile.svg";
import shop from "../../images/shop.svg";
import "./Header.css";
import Modal from "../../ui/Modal/Modal";
import { useTranslation } from "react-i18next";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const { t, i18n } = useTranslation();
  const [cartCount, setCartCount] = useState(0);
  const [open, setOpen] = useState(false);

  const [lang, setLang] = useState(() => {
    return localStorage.getItem("lang") || i18n.language || "ru";
  });

  useEffect(() => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  }, [lang, i18n]);

  useEffect(() => {
    const readCart = () => {
      try {
        const raw = localStorage.getItem("pv_cart");
        const cart = raw ? JSON.parse(raw) : [];
        setCartCount(Array.isArray(cart) ? cart.length : 0);
      } catch {
        setCartCount(0);
      }
    };
    readCart();
    window.addEventListener("storage", readCart);
    window.addEventListener("cart-updated", readCart);
    return () => {
      window.removeEventListener("storage", readCart);
      window.removeEventListener("cart-updated", readCart);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setVisible(currentScrollY < lastScrollY.current || currentScrollY < 50);
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function handleNavigate() {
    const phone = localStorage.getItem("pv_phone") || "";
    const verified = localStorage.getItem("pv_verified") === "true";
    if (verified && phone) {
      navigate("/basket");
    } else {
      setOpen(true);
    }
  }

  const isActive = (path) => location.pathname === path;

  const LangSwitcher = () => (
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
  );

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

              {/* Лого — всегда */}
              <Link className="head__logo" to="/">
                <img width={70} src={logo} alt="logo" />
              </Link>

              {/* Lang — всегда виден, позиционируется через flex */}
              <div className="head__lang-always">
                <LangSwitcher />
              </div>

              {/* Десктоп: nav ссылки */}
              <ul className="head__list head__desktop-only">
                <li className="head__item">
                  <Link className="head__link" to="/products">{t("header.catalog")}</Link>
                </li>
                <li className="head__item">
                  <a className="head__link" href="/#new">{t("header.new")}</a>
                </li>
                <li className="head__item">
                  <a className="head__link" href="/#foot">{t("header.brands")}</a>
                </li>
              </ul>

              {/* Десктоп: lang + профиль + корзина */}
              <div className="head-top__inner head__desktop-only">
                <button className="head-top__btns" onClick={() => setOpen(true)}>
                  <img src={profile} alt="profile" />
                </button>
                <button className="head-top__btns" onClick={handleNavigate} style={{ position: "relative" }}>
                  <img src={shop} alt="cart" />
                  {cartCount > 0 && (
                    <span style={{
                      position: "absolute", top: "-4px", right: "-4px",
                      background: "#1a1a1a", color: "#fff", fontSize: "10px",
                      fontWeight: "600", lineHeight: 1, minWidth: "18px", height: "18px",
                      borderRadius: "50%", display: "flex", alignItems: "center",
                      justifyContent: "center", padding: "0 3px", pointerEvents: "none",
                      fontFamily: "'Jost', sans-serif", boxShadow: "0 0 0 2px #F9F6F1",
                      animation: "cartPop .25s cubic-bezier(.36,.07,.19,.97)",
                    }}>
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
                </button>
              </div>



            </div>
          </div>
        </div>
      </header>

      {/* Мобильный таббар снизу */}
      <nav className="mobile-tabbar">

        <Link to="/" className={`mobile-tabbar__item ${isActive("/") ? "active" : ""}`}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
            <path d="M9 21V12h6v9" />
          </svg>
          <span>{t("productDetail.home")}</span>
        </Link>

        <Link to="/products" className={`mobile-tabbar__item ${isActive("/products") ? "active" : ""}`}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
          <span>{t("header.catalog")}</span>
        </Link>

        <button className={`mobile-tabbar__item ${isActive("/basket") ? "active" : ""}`} onClick={handleNavigate}>
          <span style={{ position: "relative", display: "inline-flex" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
            </svg>
            {cartCount > 0 && (
              <span className="mobile-tabbar__badge">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </span>
          <span>{t("header.cart")}</span>
        </button>

        <button className="mobile-tabbar__item" onClick={() => setOpen(true)}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span>{t("header.profile")}</span>
        </button>

      </nav>
    </>
  );
}

export default Header;