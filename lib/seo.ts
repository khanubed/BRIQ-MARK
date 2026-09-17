import type { Metadata } from "next";

export interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  noIndex?: boolean;
}

const DEFAULT_TITLE = "NAVIGO | Premium Strategic Growth Partner";
const DEFAULT_DESCRIPTION =
  "A bespoke digital marketing & growth agency engineering market dominance for luxury, high-growth, and enterprise brands across US, Canada, and UAE.";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://navigotech.io";

export function generatePageMetadata({
  title,
  description,
  canonical,
  ogImage = "/images/og-default.jpg",
  noIndex = false,
}: SEOProps): Metadata {
  const fullTitle = title === DEFAULT_TITLE ? title : `${title} | NAVIGO`;
  const canonicalUrl = canonical ? `${SITE_URL}${canonical}` : SITE_URL;

  return {
    title: fullTitle,
    description: description || DEFAULT_DESCRIPTION,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: fullTitle,
      description: description || DEFAULT_DESCRIPTION,
      url: canonicalUrl,
      siteName: "NAVIGO",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: description || DEFAULT_DESCRIPTION,
      images: [ogImage],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

export function getOrganizationStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "NAVIGO",
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.png`,
    description: DEFAULT_DESCRIPTION,
    areaServed: ["United States", "Canada", "United Arab Emirates"],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["English"],
    },
  };
}
