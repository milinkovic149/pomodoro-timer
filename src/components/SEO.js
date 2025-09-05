import Head from "next/head";

export default function SEO({
  title = "Pomodoro Productivity",
  description = "Simple Pomodoro timer for focus and increased productivity.",
  image,
  canonical,
  noindex = false,
}) {
  const siteUrl = "https://www.pomodoro-productivity.com";
  const pageUrl = canonical || siteUrl;
  const imageUrl = image || `${siteUrl}/next.svg`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": siteUrl,
    "name": title,
    "publisher": {
      "@type": "Organization",
      "name": "Pomodoro Productivity",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/next.svg`
      }
    }
  };

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={pageUrl} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:site_name" content="Pomodoro Productivity" />
      <meta property="og:image" content={imageUrl} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </Head>
  );
}
