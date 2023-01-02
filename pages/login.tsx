import NextImage from "next/image";
import {
  Container,
  VStack,
  Heading,
  Text,
  Center,
  Spinner,
} from "@chakra-ui/react";
import { SignInButton } from "../components/molecules/sign_in_button";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebaseConfig";
import Head from "next/head";

export default function Login() {
  const router = useRouter();
  const [user, loading, error] = useAuthState(auth);

  if (!router.isReady || loading) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  if (error) {
    return (
      <Center>
        <Text>Something went wrong</Text>
      </Center>
    );
  }

  if (user) {
    router.push("/");
  }

  return (
    <>
      <Head>
        <title>TraPay Login</title>
      </Head>
      <Container py={{ base: "12", md: "24" }}>
        <VStack spacing="8">
          <Heading>TraPay</Heading>
          <Text>Split the bill with your friends easily!</Text>
          <SignInButton />
          <NextImage src="/hello.svg" alt="hello" width="300" height="300" />
        </VStack>
      </Container>
    </>
  );
}
