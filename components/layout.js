import Head from "next/head"; // Page header
import Link from "next/link"; // Dynamic routing for logo

export default function Layout(props) {
  return (
    <div className="layout">
      {/* Header meta + fonts */}
      <Head>
        {/* Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap"
          rel="stylesheet"
        />

        {/* Favicons */}
        <link
          rel="apple-touch-icon"
          sizes="60x60"
          href="/favicons/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicons/favicon-16x16.png"
        />
        <link rel="manifest" href="/favicons/site.webmanifest" />
        <link
          rel="mask-icon"
          href="/favicons/safari-pinned-tab.svg"
          color="#5bbad5"
        />
        <link rel="shortcut icon" href="/favicons/favicon.ico" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta
          name="msapplication-config"
          content="/favicons/browserconfig.xml"
        />
        <meta name="theme-color" content="#ffffff" />

        {/* Meta */}
        <title>FilStats — Easy Filecoin Deal Metrics</title>
        <meta name="title" content="FilStats — Easy Filecoin Deal Metrics" />
        <meta
          name="description"
          content="Explore Filecoin's storage market and analyze the cost of storing your files!"
        />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://filstats.com" />
        <meta
          property="og:title"
          content="FilStats — Easy Filecoin Deal Metrics"
        />
        <meta
          property="og:description"
          content="Explore Filecoin's storage market and analyze the cost of storing your files!"
        />
        <meta property="og:image" content="https://filstats.com/api/meta" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://filstats.com" />
        <meta
          property="twitter:title"
          content="FilStats — Easy Filecoin Deal Metrics"
        />
        <meta
          property="twitter:description"
          content="Explore Filecoin's storage market and analyze the cost of storing your files!"
        />
        <meta
          property="twitter:image"
          content="https://filstats.com/api/meta"
        />
      </Head>

      {/* Header */}
      <div className="layout__header">
        <Link href="/">
          <a>
            <img src="/logo.png" alt="FilStats logo" />
          </a>
        </Link>
      </div>

      {/* Content with responsive constraints */}
      <div className="layout__main">
        <div className="layout__main_sizer">{props.children}</div>
      </div>

      {/* Global styles */}
      <style jsx global>{`
        body {
          margin: 0px;
          padding: 0px;
          font-family: "Roboto", sans-serif;
          background-color: #f6f7fb;
        }
      `}</style>

      {/* Scoped styles */}
      <style jsx>{`
        .layout__header {
          height: 60px;
          width: 100%;
          background-color: #10162a;
          border-bottom: 3px solid #556adc;
          text-align: center;
        }
        .layout__header > a {
          text-decoration: none;
          transition: 50ms ease-in-out;
        }
        .layout__header > a:hover {
          opacity: 0.75;
        }
        .layout__header > a > img {
          margin-top: 12px;
        }
        .layout__main {
          min-height: calc(100vh - 63px);
          width: 100%;
          text-align: center;
        }
        .layout__main_sizer {
          display: inline-block;
          padding: 25px 20px;
          max-width: 1000px;
          width: calc(100% - 40px);
        }
      `}</style>
    </div>
  );
}
