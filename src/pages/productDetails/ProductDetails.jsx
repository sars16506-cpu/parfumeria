import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useTranslation } from 'react-i18next';
import Header from '../home/Header';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../utils/cart';
import Footer from '../home/Footer';

const supabase = createClient(
  'https://jzxmnsgjzppxzsrqmubn.supabase.co',
  'sb_publishable__tro5eun0RUdTuacfwF1IQ_KMSsc6gH'
);

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .pd-root { background: #F9F6F1; min-height: 100vh; color: #1a1a1a;  }

  /* ── Breadcrumb ── */
  .pd-breadcrumb {
    display: flex; align-items: center; flex-wrap: wrap; gap: 6px;
    padding: 28px 60px 0;
    font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase; color: #999;
  }
  .pd-breadcrumb a { color: #999; text-decoration: none; transition: color .2s; }
  .pd-breadcrumb a:hover { color: #1a1a1a; }
  .pd-breadcrumb .sep { color: #ccc; }

  /* ── Main container ── */
  .pd-container {
    max-width: 1200px; margin: 0 auto;
    padding: 40px 60px 80px;
    display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: start;
  }

  /* ── Gallery ── */
  .pd-gallery {
    display: grid; grid-template-columns: 80px 1fr; gap: 16px;
    position: sticky; top: 40px;
  }
  .pd-thumbs { display: flex; flex-direction: column; gap: 12px; }
  .pd-thumb {
    width: 80px; height: 80px;
    border: 1.5px solid transparent; background: #fff;
    cursor: pointer; padding: 6px;
    transition: border-color .25s, box-shadow .25s; overflow: hidden;
  }
  .pd-thumb img { width: 100%; height: 100%; object-fit: cover; transition: transform .4s ease; }
  .pd-thumb:hover img { transform: scale(1.06); }
  .pd-thumb.active { border-color: #1a1a1a; box-shadow: 0 4px 16px rgba(0,0,0,.08); }

  .pd-main-photo {
    background: #fff; overflow: hidden; position: relative;
    aspect-ratio: 4/5; box-shadow: 0 8px 40px rgba(0,0,0,.07);
  }
  .pd-main-photo img {
    width: 100%; height: 100%; object-fit: cover;
    transition: transform .6s ease, opacity .35s ease;
  }
  .pd-main-photo img.fade { opacity: 0; transform: scale(1.03); }

  /* ── Mobile horizontal thumb strip ── */
  .pd-thumbs-strip {
    display: none;
    gap: 10px; overflow-x: auto; padding-bottom: 4px;
    scrollbar-width: none;
  }
  .pd-thumbs-strip::-webkit-scrollbar { display: none; }
  .pd-thumbs-strip .pd-thumb { width: 64px; height: 64px; flex-shrink: 0; }

  /* ── Info panel ── */
  .pd-info { padding-top: 12px; }
  .pd-category { font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #9a8c7e; margin-bottom: 14px; }
  .pd-title {   font-size: 52px; font-weight: 300; line-height: 1.1; letter-spacing: 1px; margin-bottom: 6px; }
  .pd-brand {   font-size: 18px; color: #9a8c7e; margin-bottom: 32px; }
  .pd-divider { height: 1px; background: linear-gradient(to right, #d9d0c5, transparent); margin: 24px 0; }

  /* ── Sizes ── */
  .pd-size-label { font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #9a8c7e; margin-bottom: 12px; }
  .pd-sizes { display: flex; gap: 10px; margin-bottom: 32px; flex-wrap: wrap; }
  .pd-size-btn {
    padding: 10px 20px; border: 1px solid #d9d0c5; background: transparent;
     font-size: 13px; letter-spacing: 1px;
    cursor: pointer; transition: all .25s; color: #555; position: relative;
  }
  .pd-size-btn:hover { border-color: #1a1a1a; color: #1a1a1a; }
  .pd-size-btn.active { background: #1a1a1a; border-color: #1a1a1a; color: #fff; }
  .pd-size-btn span.ml { display: block; font-size: 11px; opacity: .7; }

  /* ── Price ── */
  .pd-price-row { display: flex; align-items: baseline; gap: 16px; margin-bottom: 32px; flex-wrap: wrap; }
  .pd-price-current {  serif; font-size: 48px; font-weight: 400; color: #1a1a1a; }
  .pd-price-old { font-size: 26px; color: #bbb; text-decoration: line-through; }
  .pd-discount-badge {
    background: #c0392b; color: #fff; font-size: 11px; letter-spacing: 1.5px;
    padding: 5px 12px; border-radius: 2px; font-weight: 500; text-transform: uppercase; align-self: center;
  }

  /* ── CTA ── */
  .pd-cta { display: flex; gap: 12px; align-items: stretch; }
  .pd-add-btn {
    flex: 1; background: #1a1a1a; color: #fff; border: none;
    font-size: 13px; letter-spacing: 3px; text-transform: uppercase;
    padding: 20px 32px; cursor: pointer;
    transition: background .3s, transform .15s; position: relative; overflow: hidden;
  }
  .pd-add-btn::after { content: ''; position: absolute; inset: 0; background: rgba(255,255,255,.06); opacity: 0; transition: opacity .2s; }
  .pd-add-btn:hover::after { opacity: 1; }
  .pd-add-btn:active { transform: scale(0.98); }

  .pd-like-btn {
    width: 62px; background: transparent; border: 1px solid #d9d0c5;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: all .25s; flex-shrink: 0;
  }
  .pd-like-btn:hover { background: #1a1a1a; border-color: #1a1a1a; }
  .pd-like-btn:hover svg { stroke: #fff; }
  .pd-like-btn svg { width: 22px; height: 22px; stroke: #1a1a1a; fill: none; stroke-width: 1.5; transition: stroke .25s; }
  .pd-like-btn.liked svg { fill: #c0392b; stroke: #c0392b; }

  /* ── Tabs ── */
  .pd-tabs-section { max-width: 1200px; margin: 0 auto 100px; padding: 0 60px; }
  .pd-tabs-nav {
    display: inline-flex; background: #eee9e2; border-radius: 60px;
    padding: 5px; gap: 4px; margin-bottom: 40px;
  }
  .pd-tab-btn {
    position: relative; background: none; border: none;
    font-size: 13px; letter-spacing: 0.5px; color: #9a8c7e;
    padding: 10px 26px; border-radius: 60px; cursor: pointer;
    transition: color .25s; white-space: nowrap; z-index: 1;
  }
  .pd-tab-btn.active { color: #1a1a1a; font-weight: 500; background: #fff; box-shadow: 0 2px 12px rgba(0,0,0,.10); }

  .pd-tab-content { animation: tabSlide .35s cubic-bezier(.4,0,.2,1); }
  @keyframes tabSlide { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

  .pd-desc-text { font-size: 15px; line-height: 1.95; color: #555; font-weight: 300; max-width: 820px; }
  .pd-chars-table { width: 100%; max-width: 700px; border-collapse: collapse; }
  .pd-chars-table tr { border-bottom: 1px solid #ede8e0; transition: background .15s; }
  .pd-chars-table td { padding: 14px 12px; font-size: 14px; }
  .pd-chars-table td:first-child { color: #9a8c7e; width: 40%; font-size: 13px; }

  .pd-desc-inner { display: flex; align-items: flex-start; gap: 28px; max-width: 820px; }
  .pd-desc-initial {  font-size: 96px; font-weight: 200; line-height: 0.85; color: #d9d0c5; flex-shrink: 0; user-select: none; }

  /* ── Loader ── */
  .loader { height: 100vh; display: flex; align-items: center; justify-content: center; font-size: 24px; font-style: italic; color: #9a8c7e; background: #F9F6F1; }

  /* ══════════════════════════════════════════
     RESPONSIVE BREAKPOINTS
  ══════════════════════════════════════════ */

  /* ── Tablet (≤ 1024px) ── */
  @media (max-width: 1024px) {
    .pd-container { gap: 48px; padding: 32px 40px 60px; }
    .pd-breadcrumb { padding: 24px 40px 0; }
    .pd-title { font-size: 44px; }
    .pd-price-current { font-size: 40px; }
    .pd-tabs-section { padding: 0 40px; }
  }

  /* ── Mobile landscape / small tablet (≤ 768px) ── */
  @media (max-width: 768px) {
    .pd-breadcrumb { padding: 16px 20px 0; font-size: 11px; }

    .pd-container {
      grid-template-columns: 1fr; gap: 0;
      padding: 20px 20px 40px;
    }

    /* Switch gallery to vertical stack: big image on top, strip below */
    .pd-gallery {
      grid-template-columns: 1fr;
      grid-template-rows: auto auto;
      position: static;
      gap: 12px;
      margin-bottom: 28px;
    }
    .pd-thumbs { display: none; }          /* hide vertical thumbs */
    .pd-thumbs-strip { display: flex; }   /* show horizontal strip */

    /* Reorder: main photo first, strip second */
    .pd-main-photo { order: -1; aspect-ratio: 3/4; }
    .pd-thumbs-strip { order: 1; }

    .pd-info { padding-top: 0; }
    .pd-title { font-size: 36px; }
    .pd-brand { font-size: 16px; margin-bottom: 24px; }
    .pd-price-current { font-size: 36px; }
    .pd-price-old { font-size: 20px; }
    .pd-price-row { gap: 12px; margin-bottom: 24px; }

    .pd-add-btn { padding: 18px 24px; font-size: 12px; letter-spacing: 2px; }
    .pd-like-btn { width: 56px; }

    .pd-tabs-section { padding: 0 20px; margin-bottom: 60px; }
    .pd-tabs-nav { width: 100%; border-radius: 14px; }
    .pd-tab-btn { flex: 1; padding: 10px 8px; font-size: 12px; text-align: center; border-radius: 10px; }

    .pd-desc-initial { font-size: 64px; }
    .pd-desc-text { font-size: 14px; }
    .pd-chars-table td { padding: 12px 8px; font-size: 13px; }
  }

  /* ── Mobile portrait (≤ 480px) ── */
  @media (max-width: 480px) {
    .pd-breadcrumb { padding: 14px 16px 0; gap: 4px; }

    .pd-container { padding: 16px 16px 32px; }

    .pd-main-photo { aspect-ratio: 1/1; }

    .pd-title { font-size: 30px; letter-spacing: 0.5px; }
    .pd-category { font-size: 10px; letter-spacing: 2px; margin-bottom: 10px; }
    .pd-brand { font-size: 15px; margin-bottom: 20px; }

    .pd-sizes { gap: 8px; margin-bottom: 24px; }
    .pd-size-btn { padding: 8px 14px; font-size: 12px; }

    .pd-price-current { font-size: 30px; }
    .pd-price-old { font-size: 18px; }
    .pd-price-row { margin-bottom: 20px; }

    .pd-cta { gap: 8px; }
    .pd-add-btn { padding: 16px 16px; font-size: 11px; letter-spacing: 1.5px; }
    .pd-like-btn { width: 50px; }
    .pd-like-btn svg { width: 18px; height: 18px; }

    .pd-tabs-section { padding: 0 16px; margin-bottom: 48px; }
    .pd-tabs-nav { padding: 4px; gap: 2px; }
    .pd-tab-btn { padding: 9px 6px; font-size: 11px; }

    .pd-desc-inner { gap: 16px; }
    .pd-desc-initial { font-size: 48px; }
    .pd-desc-text { font-size: 13px; line-height: 1.8; }

    .pd-chars-table td { padding: 10px 6px; font-size: 12px; }
    .pd-chars-table td:first-child { width: 45%; font-size: 11px; }
  }
`;

const ProductDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [fading, setFading] = useState(false);
  const [activeSize, setActiveSize] = useState(0);
  const [liked, setLiked] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  function wishListed(product) {
    setLiked(l => !l);
  }

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      if (data) setProduct(data);
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  const switchImage = (idx) => {
    if (idx === activeImg) return;
    setFading(true);
    setTimeout(() => {
      setActiveImg(idx);
      setFading(false);
    }, 300);
  };

  if (loading) return (
    <>
      <style>{styles}</style>
      <div className="loader">{t('productDetail.loading')}</div>
    </>
  );

  if (!product) return (
    <>
      <style>{styles}</style>
      <div className="loader">{t('productDetail.notFound')}</div>
    </>
  );

  const currency = product.valute === 'USD' ? '$' : ' UZS';
  const currentPrice = product.prices?.[activeSize];
  const images = product.images || [];

  return (
    <>
      <Header />
      <style>{styles}</style>
      <div style={{ paddingTop: '100px' }} className="pd-root">

        {/* Breadcrumb */}
        <nav className="pd-breadcrumb">
          <Link to="/">{t('productDetail.home')}</Link>
          <span className="sep">/</span>
          <Link to="/products">{t('productDetail.newArrivals')}</Link>
          <span className="sep">/</span>
          <span style={{ color: '#1a1a1a' }}>{product.brand}</span>
        </nav>

        <div className="pd-container">

          {/* ── Gallery ── */}
          <div className="pd-gallery">

            {/* Vertical thumbs (desktop) */}
            <div className="pd-thumbs">
              {images.map((img, i) => (
                <button
                  key={i}
                  className={`pd-thumb ${activeImg === i ? 'active' : ''}`}
                  onClick={() => switchImage(i)}
                  aria-label={`Image ${i + 1}`}
                >
                  <img src={img} alt={`${product.title} ${i + 1}`} />
                </button>
              ))}
            </div>

            {/* Main image */}
            <div className="pd-main-photo">
              <img
                src={images[activeImg]}
                alt={product.title}
                className={fading ? 'fade' : ''}
              />
            </div>

            {/* Horizontal thumb strip (mobile) */}
            <div className="pd-thumbs-strip">
              {images.map((img, i) => (
                <button
                  key={i}
                  className={`pd-thumb ${activeImg === i ? 'active' : ''}`}
                  onClick={() => switchImage(i)}
                  aria-label={`Image ${i + 1}`}
                >
                  <img src={img} alt={`${product.title} ${i + 1}`} />
                </button>
              ))}
            </div>
          </div>

          {/* ── Info ── */}
          <div className="pd-info">
            <p className="pd-category">
              {t('productDetail.perfumeWater')} · {product.gender === 'women' ? t('productDetail.women') : t('productDetail.men')}
            </p>
            <h1 className="pd-title">{product.title}</h1>
            <p className="pd-brand">{product.brand}</p>

            <div className="pd-divider" />

            {/* Sizes */}
            <p className="pd-size-label">{t('productDetail.volume')}</p>
            <div className="pd-sizes">
              {product.prices.map((el, i) => (
                <button
                  key={i}
                  className={`pd-size-btn ${activeSize === i ? 'active' : ''}`}
                  onClick={() => setActiveSize(i)}
                >
                  {el.ml_sizes} {t('productDetail.ml')}
                  {el.discount > 0 && <span className="ml">-{el.discount}%</span>}
                </button>
              ))}
            </div>

            {/* Price */}
            <div className="pd-price-row">
              <span className="pd-price-current">
                {currentPrice?.price}{currency}
              </span>
              {currentPrice?.old_money !== currentPrice?.price && (
                <span className="pd-price-old">
                  {currentPrice?.old_money}{currency}
                </span>
              )}
              {currentPrice?.discount > 0 && (
                <span className="pd-discount-badge">−{currentPrice.discount}%</span>
              )}
            </div>

            {/* CTA */}
            <div className="pd-cta">
              <button
                className="pd-add-btn"
                onClick={() => addToCart({
                  product_id: product.id,
                  title: product.title,
                  brand: product.brand,
                  price: currentPrice?.price ?? 0,
                  ml_sizes: currentPrice?.ml_sizes ?? null,
                  valute: product.valute,
                  image: images[0],
                })}
              >
                {t('productDetail.addToCart')}
              </button>

            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="pd-tabs-section">
          <nav className="pd-tabs-nav">
            {[
              { key: 'description', label: t('productDetail.tabs.description') },
              { key: 'characteristics', label: t('productDetail.tabs.characteristics') },
            ].map(tab => (
              <button
                key={tab.key}
                className={`pd-tab-btn ${activeTab === tab.key ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {activeTab === 'description' && (
            <div className="pd-tab-content" key="description">
              <div className="pd-desc-inner">
                <div className="pd-desc-initial">{product.brand?.[0]?.toUpperCase()}</div>
                <p className="pd-desc-text">
                  {product.info || t('productDetail.noDescription')}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'characteristics' && (
            <div className="pd-tab-content" key="characteristics">
              <table className="pd-chars-table">
                <tbody>
                  <tr><td>{t('productDetail.chars.brand')}</td><td>{product.brand}</td></tr>
                  <tr><td>{t('productDetail.chars.gender')}</td><td>{product.gender === 'women' ? t('productDetail.women') : t('productDetail.men')}</td></tr>
                  <tr><td>{t('productDetail.chars.type')}</td><td>{t('productDetail.chars.edp')}</td></tr>
                  {product.release_date && (
                    <tr><td>{t('productDetail.chars.releaseYear')}</td><td>{new Date(product.release_date).getFullYear()}</td></tr>
                  )}
                  {product.prices.map((p, i) => (
                    <tr key={i}>
                      <td>{t('productDetail.chars.volumeItem')} {product.prices.length > 1 ? i + 1 : ''}</td>
                      <td>{p.ml_sizes} {t('productDetail.ml')}</td>
                    </tr>
                  ))}
                  <tr><td>{t('productDetail.chars.currency')}</td><td>{product.valute}</td></tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      <Footer />
    </>
  );
};

export default ProductDetail;