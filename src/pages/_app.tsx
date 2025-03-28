import "../app/globals.css";
import type { AppProps } from "next/app";
import Header from "../components/Header";
import { AuthProvider } from "../lib/AuthContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Header />
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
