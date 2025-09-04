import Head from 'next/head';

// Reusable SEO component with sensible English defaults
export default function SEO({
  title = 'Pomodoro Timer — Focus & Productivity',
  description = 'Boost focus and productivity with this lightweight Pomodoro timer. Track pomodoros, manage breaks, and stay on task.',
  keywords = 'pomodoro, pomodoro timer, productivity, focus, time management, task timer, study timer',
  url = 'https://yourdomain.com/',
  image = 'https://yourdomain.com/pomo-background.webp',
  type = 'website',
  locale = 'en_US',
  author = 'Your Name or Company',
  canonical = undefined,
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
        "description": description
      },
      {
        "@type": "SoftwareApplication",
        "@id": canonicalUrl + "#software",
        "name": fullTitle,
        "url": canonicalUrl,
        "description": description,
        "applicationCategory": "Education",
        "operatingSystem": "Web",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
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
