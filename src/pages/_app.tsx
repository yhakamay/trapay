import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Router } from "next/router";
import { Inter } from "@next/font/google";
import { Analytics } from "@vercel/analytics/react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import Header from "../components/organisms/header";
import Footer from "../components/organisms/footer";
import { theme } from "../../theme";
import { useLocale } from "../../locale";

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

const inter = Inter({
  subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps) {
  const { t } = useLocale();

  return (
    <ChakraProvider theme={theme}>
      <Head>
        <title>TraPay</title>
        <meta name="description" content={t.appDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:image" content="/trapay.png" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className={inter.className}>
        <Component {...pageProps} />
        <Analytics />
      </main>
      <Footer />
    </ChakraProvider>
  );
}
