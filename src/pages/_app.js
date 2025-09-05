import "@/styles/globals.css";
import { UserProvider } from "@/contexts/UserContext";
import SEO from "@/components/SEO";

export default function App({ Component, pageProps }) {
  return (
    <UserProvider>
      <SEO />
      <Component {...pageProps} />
    </UserProvider>
  );
}
