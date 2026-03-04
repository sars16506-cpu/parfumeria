import React from "react";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Seo from "./Seo";

const BASE_URL = "https://glow-parfum-uz.vercel.app";

// Hreflang links for multilingual SEO
function HreflangLinks({ path }) {
  return (
    <Helmet>
      <link rel="canonical" href={`${BASE_URL}${path}`} />
      <link rel="alternate" hreflang="uz" href={`${BASE_URL}${path}`} />
      <link rel="alternate" hreflang="ru" href={`${BASE_URL}${path}`} />
      <link rel="alternate" hreflang="en" href={`${BASE_URL}${path}`} />
      <link rel="alternate" hreflang="x-default" href={`${BASE_URL}${path}`} />
    </Helmet>
  );
}

function SeoRouter() {
  const { pathname } = useLocation();

  if (pathname.startsWith("/adm"))
    return (
      <>
        <HreflangLinks path="/adm" />
        <Seo
          titleKey="admin.title"
          descKey="admin.title"
          robots="noindex, nofollow"
        />
      </>
    );

  if (pathname.startsWith("/basket"))
    return (
      <>
        <HreflangLinks path="/basket" />
        <Seo
          titleKey="allProducts.home"
          descKey="allProducts.searchPlaceholder"
          robots="noindex, nofollow"
        />
      </>
    );

  if (pathname.startsWith("/products"))
    return (
      <>
        <HreflangLinks path="/products" />
        <Seo
          titleKey="products.hero_title"
          descKey="products.hero_subtitle"
        />
      </>
    );

  if (pathname.startsWith("/details")) {
    const id = pathname.split("/")[2] || "";
    return (
      <>
        <HreflangLinks path={`/details/${id}`} />
        <Seo
          titleKey="productDetail.perfumeWater"
          descKey="hero.info"
        />
      </>
    );
  }

  return (
    <>
      <HreflangLinks path="/" />
      <Seo titleKey="hero.title" descKey="hero.info" />
    </>
  );
}

export default SeoRouter;