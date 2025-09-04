import Head from 'next/head';

// Reusable SEO component with sensible English defaults
export default function SEO({
  title = 'Pomodoro Productivity — Focus with Pomodoro',
  description = 'Boost your focus and productivity with Pomodoro Productivity — a sleek Pomodoro timer, task manager and progress tracker designed to keep you in flow.',
  keywords = 'pomodoro, pomodoro timer, productivity, focus, task manager, time management, study timer',
  url = 'https://www.pomodoro-productivity.com/',
  image = 'https://www.pomodoro-productivity.com/og-image.png',
  type = 'website',
  locale = 'en_US',
  author = 'Pomodoro Productivity',
  canonical = undefined,
  twitterHandle = '@pomodoro_prod',
}) {
  const fullTitle = title;
  const canonicalUrl = canonical || url;
  const imageUrl = image;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": canonicalUrl + "#website",
        "url": canonicalUrl,
        "name": fullTitle,
        "description": description,
        "publisher": { "@type": "Organization", "name": author }
      },
      {
        "@type": "SoftwareApplication",
        "@id": canonicalUrl + "#software",
        "name": fullTitle,
        "url": canonicalUrl,
        "description": description,
        "applicationCategory": "ProductivityApplication",
        "operatingSystem": "Web",
        "image": imageUrl,
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }
    ]
  };

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content="index,follow" />
      <meta name="revisit-after" content="7 days" />

      {/* Canonical and hreflang */}
      <link rel="canonical" href={canonicalUrl} />
      <link rel="alternate" hrefLang="en" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:locale" content={locale} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:creator" content={twitterHandle} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {/* JSON-LD structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Recommended defaults */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
  );
}
