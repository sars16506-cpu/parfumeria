import React from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

function Seo({
  titleKey = "hero.title",
  descKey = "hero.info",
  robots = "index, follow",
  image = "/og.jpg",
}) {
  const { t, i18n } = useTranslation();

  const title = t(titleKey);
  const description = t(descKey);

  return (
    <Helmet htmlAttributes={{ lang: i18n.language }}>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Parfum Glow" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}

export default Seo;