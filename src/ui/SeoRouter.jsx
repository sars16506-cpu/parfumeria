import React from "react";
import { useLocation } from "react-router-dom";
import Seo from "./Seo";

function SeoRouter() {
  const { pathname } = useLocation();

  if (pathname.startsWith("/adm"))
    return <Seo titleKey="admin.title" descKey="admin.title" robots="noindex, nofollow" />;

  if (pathname.startsWith("/basket"))
    return <Seo titleKey="allProducts.home" descKey="allProducts.searchPlaceholder" robots="noindex, nofollow" />;

  if (pathname.startsWith("/products"))
    return <Seo titleKey="products.hero_title" descKey="products.hero_subtitle" />;

  if (pathname.startsWith("/details"))
    return <Seo titleKey="productDetail.home" descKey="productDetail.perfumeWater" />;

  return <Seo titleKey="hero.title" descKey="hero.info" />;
}

export default SeoRouter;