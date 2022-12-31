import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import Header from "../components/organisms/header";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <Header />
      <Component {...pageProps} />
    </ChakraProvider>
  );
}
