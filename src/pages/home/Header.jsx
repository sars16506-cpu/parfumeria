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
  const [cartCount, setCartCount] = useState(0);

  const [lang, setLang] = useState(() => {
    return localStorage.getItem("lang") || i18n.language || "ru";
  });

  useEffect(() => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  }, [lang, i18n]);

  // Читаем pv_cart при монтировании и слушаем изменения
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

    // Слушаем storage событие (другие вкладки)
    window.addEventListener("storage", readCart);

    // Слушаем кастомное событие (та же вкладка — из addToCart утилиты)
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

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);
  const [open, setOpen] = useState(false);

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

  const CartIcon = () => (
    <button className="head-top__btns" onClick={handleNavigate} style={{ position: "relative" }}>
      <img src={shop} alt="cart" />
      {cartCount > 0 && (
        <span style={{
          position: "absolute",
          top: "-4px",
          right: "-4px",
          background: "#1a1a1a",
          color: "#fff",
          fontSize: "10px",
          fontWeight: "600",
          lineHeight: 1,
          minWidth: "18px",
          height: "18px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 3px",
          pointerEvents: "none",
          fontFamily: "'Jost', sans-serif",
          letterSpacing: 0,
          boxShadow: "0 0 0 2px #F9F6F1",
          animation: "cartPop .25s cubic-bezier(.36,.07,.19,.97)",
        }}>
          {cartCount > 99 ? "99+" : cartCount}
        </span>
      )}
      <style>{`
        @keyframes cartPop {
          0%   { transform: scale(0.4); opacity: 0; }
          70%  { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1);   opacity: 1; }
        }
      `}</style>
    </button>
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
              <Link className="head__logo" to="/">
                <img src={logo} alt="logo" />
              </Link>

              <ul className="head__list">
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
                <CartIcon />
              </div>

              <button
                className={`head__burger ${menuOpen ? "open" : ""}`}
                onClick={() => setMenuOpen((o) => !o)}
                aria-label="Menu"
              >
                <span /><span /><span />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <nav className={`head__drawer ${menuOpen ? "open" : ""}`}>
        <button className="head__drawer-close" onClick={closeMenu}>&times;</button>
        <ul className="head__list">
          <li className="head__item">
            <Link className="head__link" to="/products" onClick={closeMenu}>{t("header.catalog")}</Link>
          </li>
          <li className="head__item">
            <a className="head__link" href="/#foot" onClick={closeMenu}>{t("header.brands")}</a>
          </li>
          <li className="head__item">
            <a className="head__link" href="/#new" onClick={closeMenu}>{t("header.new")}</a>
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
          <button className="head-top__btns" onClick={() => { setOpen(true); closeMenu(); }}>
            <img src={profile} alt="profile" />
          </button>
          <CartIcon />
        </div>
      </nav>
    </>
  );
}

export default Header;