import "@/styles/globals.css";
import { UserProvider } from "@/contexts/UserContext";
import Head from 'next/head';

export default function App({ Component, pageProps }) {
  return (
    <UserProvider>
      <Head>
        <meta name="application-name" content="Pomodoro Timer" />
        <meta name="apple-mobile-web-app-title" content="Pomodoro Timer" />
      </Head>
      <Component {...pageProps} />
    </UserProvider>
  );
}
