import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGetProductsQuery } from "../../app/services/authApi";
import { addToCart } from "../../utils/cart";
import "./NewArrivals.css";

// Helper: Format currency based on locale and currency type
function formatMoney(n, valute = "UZS") {
    const num = Number(n || 0);
    try {
        return new Intl.NumberFormat("uz-UZ", {
            style: "currency",
            currency: valute,
            maximumFractionDigits: valute === "UZS" ? 0 : 2,
        }).format(num);
    } catch {
        return `${num.toLocaleString()} ${valute}`;
    }
}

// Helper: Get first image or placeholder
function firstImage(images) {
    if (Array.isArray(images) && images.length) return images[0];
    return "https://via.placeholder.com/600x600?text=No+Image";
}

// Helper: Get first price entry
function getFirstPrice(prices) {
    if (!Array.isArray(prices) || prices.length === 0) return null;
    return prices[0];
}

// Helper: Calculate discount %
function calcDiscountPercent(entry) {
    const d = Number(entry?.discount ?? 0);
    if (!Number.isFinite(d) || d <= 0) return 0;
    return Math.min(100, Math.max(0, d));
}

// Helper: Get translated gender labels
function genderLabel(g, t) {
    if (g === "men") return t('newArrivals.men');
    if (g === "women") return t('newArrivals.women');
    if (g === "unisex") return t('newArrivals.unisex');
    return g || "—";
}

export default function NewArrivals() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const {
        data: productsRaw = [],
        isLoading,
        isError,
        error,
        refetch,
    } = useGetProductsQuery();

    const [expanded, setExpanded] = useState(false);
    const [q, setQ] = useState("");
    const [gender, setGender] = useState("all");
    const [addedId, setAddedId] = useState(null);

    // Filter logic
    const products = useMemo(() => {
        const s = q.trim().toLowerCase();
        return (Array.isArray(productsRaw) ? productsRaw : []).filter((p) => {
            const matchSearch =
                !s ||
                (p.title || "").toLowerCase().includes(s) ||
                (p.brand || "").toLowerCase().includes(s);

            const matchGender = gender === "all" ? true : p.gender === gender;
            return matchSearch && matchGender;
        });
    }, [productsRaw, q, gender]);

    const total = products.length;
    const visibleLimit = expanded ? 20 : 8;

    const visible = useMemo(() => {
        return products.slice(0, visibleLimit);
    }, [products, visibleLimit]);

    const shouldRenderSection = !isLoading && !isError && total > 0;
    const showSeeMore = !expanded && total > 8;
    const showSeeAll = expanded && total > 20;

    // Handle focus from navigation state
    useEffect(() => {
        if (location.state?.focusSearch) {
            const el = document.getElementById("home-search");
            if (el) {
                el.focus();
                el.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }
    }, [location]);

    return (
        <div id="new" className="pp">
            <header className="pp-hero">
                <div className="pp-container pp-hero-inner">
                    <div className="pp-hero-left">
                        <h1 className="pp-title">{t('newArrivals.heroTitle')}</h1>
                        <p className="pp-subtitle">{t('newArrivals.heroSubtitle')}</p>
                    </div>
                </div>
            </header>

            <main className="pp-container pp-main">
                {/* Loading State */}
                {isLoading && (
                    <div className="pp-skeletonGrid" aria-hidden="true">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="pp-skelCard">
                                <div className="pp-skelImg" />
                                <div className="pp-skelLine pp-skelLine1" />
                                <div className="pp-skelLine pp-skelLine2" />
                                <div className="pp-skelPills" />
                            </div>
                        ))}
                    </div>
                )}

                {/* Error State */}
                {isError && (
                    <div className="pp-error">
                        <div className="pp-errorTop">
                            <h3>{t('newArrivals.errorTitle')}</h3>
                            <button className="pp-btn" onClick={refetch}>{t('newArrivals.retry')}</button>
                        </div>
                        <pre className="pp-errorBox">
                            {error?.data?.message || error?.error || "Something went wrong"}
                        </pre>
                    </div>
                )}

                {/* Filters */}
                {!isLoading && !isError && (
                    <div className="pp-toolbar">
                        <div className="pp-searchWrap">
                            <input 
                                id="home-search"
                                className="pp-input"
                                placeholder={t('newArrivals.searchPlaceholder')}
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                            />
                            {q && (
                                <button className="pp-clear" onClick={() => setQ("")} aria-label="Clear search">✕</button>
                            )}
                        </div>

                        <select
                            className="pp-select"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                        >
                            <option value="all">{t('newArrivals.allGenders')}</option>
                            <option value="men">{t('newArrivals.men')}</option>
                            <option value="women">{t('newArrivals.women')}</option>
                            <option value="unisex">{t('newArrivals.unisex')}</option>
                        </select>
                    </div>
                )}

                {/* Products Grid */}
                {shouldRenderSection && (
                    <section className="pp-section">
                        <div className="pp-sectionHead">
                            <div>
                                <h2 className="pp-sectionTitle">{t('newArrivals.featured')}</h2>
                                <p className="pp-muted">
                                    {t('newArrivals.showing')} <b>{visible.length}</b> {t('newArrivals.of')} <b>{total}</b>
                                </p>
                            </div>
                        </div>

                        <div className="pp-grid">
                            {visible.map((p) => {
                                const entry = getFirstPrice(p.prices);
                                const discount = calcDiscountPercent(entry);
                                const img = firstImage(p.images);
                                const price = entry?.price ?? 0;
                                const old = entry?.old_money ?? 0;
                                const ml = entry?.ml_sizes ?? null;

                                const showOld = Number(old) > 0 && Number(old) !== Number(price) && discount > 0;

                                return (
                                    <article key={p.id} className="pp-card">
                                        <div className="pp-imgWrap">
                                            <img 
                                                className="pp-img" 
                                                src={img} 
                                                alt={p.title || "Product"} 
                                                loading="lazy" 
                                                onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/600x600?text=No+Image"; }}
                                            />
                                            {discount > 0 && <span className="pp-discountBadge">-{discount}%</span>}
                                        </div>

                                        <div className="pp-cardBody">
                                            <div className="pp-cardTop">
                                                <div className="pp-meta">
                                                    <span className="pp-brand">{p.brand || "—"}</span>
                                                    <span className="pp-dot">•</span>
                                                    <span className={`pp-gender ${p.gender}`}>
                                                        {genderLabel(p.gender, t)}
                                                    </span>
                                                </div>
                                                <h3 className="pp-cardTitle" title={p.title}>{p.title || "Untitled"}</h3>
                                            </div>

                                            <div className="pp-priceRow">
                                                <div className="pp-priceMain">{formatMoney(price, p.valute)}</div>
                                                {showOld && <div className="pp-priceOld">{formatMoney(old, p.valute)}</div>}
                                            </div>

                                            <div className="pp-pills">
                                                {ml ? <span className="pp-pill">{ml} ml</span> : <span className="pp-pill pp-pill-muted">{t('newArrivals.noMl')}</span>}
                                                {p.release_date && <span className="pp-pill">{p.release_date}</span>}
                                            </div>

                                            {p.info && <p className="pp-info" title={p.info}>{p.info}</p>}

                                            <div className="pp-cardActions">
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
                                                    {addedId === p.id ? "Added ✓" : t('newArrivals.addToCart')}
                                                </button>
                                                <button className="pp-btn" onClick={() => navigate(`/details/${p.id}`)}>
                                                    {t('newArrivals.details')}
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>

                        <div className="pp-showMoreWrap">
                            {showSeeMore && (
                                <button className="pp-btn pp-btn-primary" onClick={() => setExpanded(true)}>
                                    {t('newArrivals.seeMore')}
                                </button>
                            )}
                            {showSeeAll && (
                                <Link className="pp-btn pp-btn-primary" to="/products">
                                    {t('newArrivals.seeAll')}
                                </Link>
                            )}
                        </div>
                    </section>
                )}

                {/* Empty State: No results from filter */}
                {!isLoading && !isError && productsRaw.length > 0 && total === 0 && (
                    <div className="pp-empty">
                        <h3>{t('newArrivals.noMatching')}</h3>
                        <p className="pp-muted">{t('newArrivals.tryAnother')}</p>
                        <button className="pp-btn" onClick={() => { setQ(""); setGender("all"); setExpanded(false); }}>
                            {t('newArrivals.resetFilters')}
                        </button>
                    </div>
                )}

                {/* Empty State: Database empty */}
                {!isLoading && !isError && productsRaw.length === 0 && (
                    <div className="pp-empty">
                        <h3>{t('newArrivals.noProducts')}</h3>
                        <p className="pp-muted">{t('newArrivals.soon')}</p>
                        <button className="pp-btn" onClick={refetch}>{t('newArrivals.refresh')}</button>
                    </div>
                )}
            </main>
        </div>
    );
}