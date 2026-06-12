import type { Metadata } from "next";
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";
import { getSiteContent } from "@/lib/content";

const site = getSiteContent();

export const metadata: Metadata = {
  metadataBase: new URL(site.siteUrl),
  title: {
    default: `${site.name} | ${site.role}`,
    template: `%s | ${site.name}`,
  },
  description: site.tagline,
  keywords: [
    "Data Engineer",
    "Analytics Engineering",
    "Data Platforms",
    "Data Warehousing",
    "Azure",
    "AWS",
    "Databricks",
    "dbt",
    "BigQuery",
    site.name,
  ],
  authors: [{ name: site.name, url: site.siteUrl }],
  openGraph: {
    type: "website",
    url: site.siteUrl,
    title: `${site.name} | ${site.role}`,
    description: site.tagline,
    siteName: site.name,
    images: [{ url: site.profileImage, width: 1053, height: 1080, alt: site.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | ${site.role}`,
    description: site.tagline,
  },
  robots: { index: true, follow: true },
};

const themeInit = `(function(){try{var t=localStorage.getItem("theme");if(t==="light"||(!t&&window.matchMedia("(prefers-color-scheme: light)").matches)){document.documentElement.classList.add("light")}}catch(e){}})()`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    jobTitle: site.role,
    description: site.tagline,
    url: site.siteUrl,
    image: `${site.siteUrl}${site.profileImage}`,
    email: `mailto:${site.email}`,
    sameAs: [site.social.github, site.social.linkedin, site.social.twitter].filter(
      Boolean
    ),
    knowsAbout: site.focusAreas,
  };

  return (
    <html lang="en" className="scroll-pt-24" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
