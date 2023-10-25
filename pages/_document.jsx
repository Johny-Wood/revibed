import { Head, Html, Main, NextScript } from 'next/document';

function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" key="charset" />
        <meta property="og:type" content="website" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta name="theme-color" content="#ffffff" />
        {process.env.NEXT_STATIC_FACEBOOK_DOMAIN_VERIFICATION && (
          <meta name="facebook-domain-verification" content={process.env.NEXT_STATIC_FACEBOOK_DOMAIN_VERIFICATION} />
        )}
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon192.png" />
        <link rel="manifest" href="/manifest.json" />
        <link
          rel="preload"
          href="/fonts/Inter/Inter-Regular/Inter-Regular.woff2"
          as="font"
          type="font/woff"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Inter/Inter-Medium/Inter-Medium.woff2"
          as="font"
          type="font/woff"
          crossOrigin="anonymous"
        />
        <link rel="preload" href="/fonts/Inter/Inter-Bold/Inter-Bold.woff2" as="font" type="font/woff" crossOrigin="anonymous" />
        <link
          rel="preload"
          href="/fonts/Inter/Inter-Black/Inter-Black.woff2"
          as="font"
          type="font/woff"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Inter/Inter-SemiBold/Inter-SemiBold.woff2"
          as="font"
          type="font/woff"
          crossOrigin="anonymous"
        />
        <link rel="preload" href="/fonts/FuturaDemiC/FuturaDemiC.woff2" as="font" type="font/woff" crossOrigin="anonymous" />
        <link
          rel="preload"
          href="/fonts/FuturaPT/FuturaPT-SemiBold/FuturaPT-SemiBold.woff2"
          as="font"
          type="font/woff"
          crossOrigin="anonymous"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

export default Document;
