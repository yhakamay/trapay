import {
  ChakraProvider,
  extendTheme,
  withDefaultColorScheme,
  theme as baseTheme,
} from "@chakra-ui/react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Router } from "next/router";
import { Inter } from "@next/font/google";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import Header from "../components/organisms/header";
import Footer from "../components/organisms/footer";

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

const inter = Inter({
  subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Head>
        <title>TraPay</title>
        <meta
          name="description"
          content="Split the bill with your friends easily!"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className={inter.className}>
        <Component {...pageProps} />
      </main>
      <Footer />
    </ChakraProvider>
  );
}

const theme = extendTheme(
  {
    colors: {
      brand: baseTheme.colors.purple,
    },
  },
  withDefaultColorScheme({ colorScheme: "brand" })
);
