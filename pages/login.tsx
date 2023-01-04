import NextImage from "next/image";
import { Container, VStack, Heading, Text, Center } from "@chakra-ui/react";
import { SignInButton } from "../components/molecules/sign_in_button";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebaseConfig";
import Head from "next/head";
import Loading from "../components/atoms/loading";
import { GetServerSideProps } from "next";

type LoginProps = {
  id?: string;
};

export default function Login(props: LoginProps) {
  const { id } = props;
  const router = useRouter();
  const [user, loading, error] = useAuthState(auth);

  if (!router.isReady || loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Center>
        <Text>Something went wrong</Text>
      </Center>
    );
  }

  if (user) {
    if (id) {
      router.push(`/e/${id}`);
    } else {
      router.push("/");
    }
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { e } = context.query;

  return {
    props: {
      id: e ?? null,
    },
  };
};
