import "@/styles/globals.css";
import { UserProvider } from "@/contexts/UserContext";
import SEO from "@/components/SEO";
import Head from 'next/head';

export default function App({ Component, pageProps }) {
  return (
    <UserProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <SEO />
      <Component {...pageProps} />
    </UserProvider>
  );
}
