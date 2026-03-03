import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGetProductsQuery } from "../../app/services/authApi";
import "./Products.css";
import Header from "../home/Header";
import { addToCart } from '../../utils/cart'; // Cart utility imported

function formatMoney(n, valute = "USD") {
  const num = Number(n || 0);
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: valute,
      maximumFractionDigits: valute === "UZS" ? 0 : 2,
    }).format(num);
  } catch {
    return `${num.toLocaleString()} ${valute}`;
  }
}

function firstImage(images) {
  if (Array.isArray(images) && images.length) return images[0];
  return "https://via.placeholder.com/600x600?text=No+Image";
}

function getFirstPrice(prices) {
  if (!Array.isArray(prices) || prices.length === 0) return null;
  return prices[0];
}

function calcDiscountPercent(entry) {
  const d = Number(entry?.discount ?? 0);
  if (!Number.isFinite(d) || d <= 0) return 0;
  return Math.min(100, Math.max(0, d));
}

// Gender label with translation support
function genderLabel(g, t) {
  if (g === "men") return t('allProducts.genderOptions.men');
  if (g === "women") return t('allProducts.genderOptions.women');
  if (g === "unisex") return t('allProducts.genderOptions.unisex');
  return g || "—";
}

export default function Products() {
  const { t } = useTranslation();
  const [addedId, setAddedId] = useState(null); // Feedback state for cart
  
  const {
    data: productsRaw = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetProductsQuery();

  // Scroll to top on mount
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [q, setQ] = useState("");
  const [gender, setGender] = useState("all");
  const [selectedMl, setSelectedMl] = useState([]);
  const [sliderMin, setSliderMin] = useState(null);
  const [sliderMax, setSliderMax] = useState(null);

  // Derive dynamic options
  const { minPrice, maxPrice, mlOptions } = useMemo(() => {
    const arr = Array.isArray(productsRaw) ? productsRaw : [];
    let min = Infinity;
    let max = -Infinity;
    const mlSet = new Set();

    arr.forEach((p) => {
      const prices = Array.isArray(p.prices) ? p.prices : [];
      prices.forEach((entry) => {
        const price = Number(entry.price ?? 0);
        if (price < min) min = price;
        if (price > max) max = price;
        if (entry.ml_sizes != null) mlSet.add(Number(entry.ml_sizes));
      });
    });

    return {
      minPrice: isFinite(min) ? min : 0,
      maxPrice: isFinite(max) ? max : 1000,
      mlOptions: Array.from(mlSet).sort((a, b) => a - b),
    };
  }, [productsRaw]);

  const activeMin = sliderMin ?? minPrice;
  const activeMax = sliderMax ?? maxPrice;

  const toggleMl = (ml) =>
    setSelectedMl((prev) =>
      prev.includes(ml) ? prev.filter((x) => x !== ml) : [...prev, ml]
    );

  const resetFilters = () => {
    setQ("");
    setGender("all");
    setSliderMin(null);
    setSliderMax(null);
    setSelectedMl([]);
  };

  const products = useMemo(() => {
    const s = q.trim().toLowerCase();
    return (Array.isArray(productsRaw) ? productsRaw : []).filter((p) => {
      const matchSearch =
        !s ||
        (p.title || "").toLowerCase().includes(s) ||
        (p.brand || "").toLowerCase().includes(s);

      const matchGender = gender === "all" || p.gender === gender;
      const prices = Array.isArray(p.prices) ? p.prices : [];

      const matchPrice =
        prices.length === 0 ||
        prices.some((entry) => {
          const price = Number(entry.price ?? 0);
          return price >= activeMin && price <= activeMax;
        });

      const matchMl =
        selectedMl.length === 0 ||
        prices.some(
          (entry) =>
            entry.ml_sizes != null && selectedMl.includes(Number(entry.ml_sizes))
        );

      return matchSearch && matchGender && matchPrice && matchMl;
    });
  }, [productsRaw, q, gender, activeMin, activeMax, selectedMl]);

  const activeFilterCount = [
    gender !== "all",
    sliderMin !== null || sliderMax !== null,
    selectedMl.length > 0,
  ].filter(Boolean).length;

  const pctMin = maxPrice > minPrice ? ((activeMin - minPrice) / (maxPrice - minPrice)) * 100 : 0;
  const pctMax = maxPrice > minPrice ? ((activeMax - minPrice) / (maxPrice - minPrice)) * 100 : 100;

  return (
    <div className="prd-root">
      <Header />
      <div className="prd-layout">
        {/* Sidebar */}
        <aside className="prd-sidebar">
          <div className="prd-sidebarHeader">
            <span className="prd-sidebarTitle">{t('allProducts.filters')}</span>
            {activeFilterCount > 0 && (
              <button className="prd-resetBtn" onClick={resetFilters}>
                {t('allProducts.clearAll')}
              </button>
            )}
          </div>

          <div className="prd-filterBlock">
            <p className="prd-filterLabel">{t('allProducts.gender')}</p>
            <div className="prd-genderList">
              {["all", "men", "women", "unisex"].map((g) => (
                <button
                  key={g}
                  className={`prd-genderItem ${gender === g ? "active" : ""}`}
                  onClick={() => setGender(g)}
                >
                  <span className="prd-radio" />
                  {g === "all" ? t('allProducts.genderOptions.all') : genderLabel(g, t)}
                </button>
              ))}
            </div>
          </div>

          {!isLoading && maxPrice > minPrice && (
            <div className="prd-filterBlock">
              <p className="prd-filterLabel">{t('allProducts.price')}</p>
              <div className="prd-priceValues">
                <span>{formatMoney(activeMin, productsRaw[0]?.valute)}</span>
                <span>{formatMoney(activeMax, productsRaw[0]?.valute)}</span>
              </div>
              <div className="prd-rangeWrap">
                <div className="prd-rangeTrack">
                  <div className="prd-rangeTrackFill" style={{ left: `${pctMin}%`, right: `${100 - pctMax}%` }} />
                </div>
                <input type="range" className="prd-range" min={minPrice} max={maxPrice} step={1} value={activeMin}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val <= activeMax) setSliderMin(val);
                  }}
                />
                <input type="range" className="prd-range" min={minPrice} max={maxPrice} step={1} value={activeMax}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val >= activeMin) setSliderMax(val);
                  }}
                />
              </div>
            </div>
          )}

          {mlOptions.length > 0 && (
            <div className="prd-filterBlock">
              <p className="prd-filterLabel">{t('allProducts.size')}</p>
              <div className="prd-mlGrid">
                {mlOptions.map((ml) => (
                  <button key={ml} className={`prd-mlBtn ${selectedMl.includes(ml) ? "active" : ""}`} onClick={() => toggleMl(ml)}>
                    {ml} {t('allProducts.ml')}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="prd-sidebarFooter">
            {products.length} {t('allProducts.results')}
          </div>
        </aside>

        {/* Main Content */}
        <main className="prd-main">
          <div className="prd-topbar">
            <Link className="prd-backBtn" to="/">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M19 12H5M5 12l7-7M5 12l7 7" />
              </svg>
              {t('allProducts.home')}
            </Link>
            <div className="prd-searchWrap">
              <input
                className="prd-searchInput"
                placeholder={t('allProducts.searchPlaceholder')}
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              {q && <button className="prd-searchClear" onClick={() => setQ("")}>✕</button>}
            </div>
            <span className="prd-countLabel">
              {isLoading ? t('allProducts.loading') : `${products.length} ${t('allProducts.productsCount')}`}
            </span>
          </div>

          {!isLoading && !isError && products.length === 0 && (
            <div className="prd-empty">
              <h3>{t('allProducts.noProducts')}</h3>
              <button className="prd-btn" onClick={resetFilters}>{t('allProducts.resetFilters')}</button>
            </div>
          )}

          <div className="prd-grid">
            {products.map((p) => {
              const entry = getFirstPrice(p.prices);
              const discount = calcDiscountPercent(entry);
              const img = firstImage(p.images);
              const price = entry?.price ?? 0;
              const old = entry?.old_money ?? 0;
              const ml = entry?.ml_sizes ?? null;
              const showOld = Number(old) > 0 && Number(old) !== Number(price) && discount > 0;

              return (
                <article key={p.id} className="prd-card">
                  <div className="prd-imgWrap">
                    <img className="prd-img" src={img} alt={p.title} loading="lazy" />
                    {discount > 0 && <span className="prd-discountBadge">−{discount}%</span>}
                  </div>

                  <div className="prd-cardBody">
                    <div className="prd-cardTop">
                      <div className="prd-meta">
                        <span className="prd-brand">{p.brand || "—"}</span>
                        <span className="prd-dot">•</span>
                        <span className={`prd-gender ${p.gender}`}>
                          {genderLabel(p.gender, t)}
                        </span>
                      </div>
                      <h3 className="prd-cardTitle">{p.title}</h3>
                    </div>

                    <div className="prd-priceRow">
                      <span className="prd-priceMain">{formatMoney(price, p.valute)}</span>
                      {showOld && <span className="prd-priceOld">{formatMoney(old, p.valute)}</span>}
                    </div>

                    <div className="prd-pills">
                      <span className="prd-pill">{ml ? `${ml} ${t('allProducts.ml')}` : t('allProducts.noMl')}</span>
                      <span className="prd-pill">{p.release_date || t('allProducts.noDate')}</span>
                    </div>

                    <div className="prd-cardActions">
                      <button 
                        className="prd-btn prd-btn-ghost"
                        onClick={() => {
                          addToCart({
                            product_id: p.id,
                            title: p.title,
                            brand: p.brand,
                            price: price,
                            ml_sizes: ml,
                            valute: p.valute,
                            image: img,
                          });
                          setAddedId(p.id);
                          setTimeout(() => setAddedId(null), 1000);
                        }}
                      >
                        {addedId === p.id ? "Added ✓" : t('allProducts.addToCart')}
                      </button>
                      <Link className="prd-btn" to={`/details/${p.id}`}>{t('allProducts.details')}</Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}