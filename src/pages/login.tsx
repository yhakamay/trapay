import NextImage from "next/image";
import { Container, VStack, Heading, Text, Box } from "@chakra-ui/react";
import { SignInButton } from "../components/molecules/sign_in_buttons";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firebase";
import Head from "next/head";
import Loading from "../components/atoms/loading";
import { GetServerSideProps } from "next";
import { useLocale } from "../locale";
import { SomethingWentWrong } from "../components/atoms/something_went_wrong";

type LoginProps = {
  id?: string;
};

export default function Login(props: LoginProps) {
  const { id } = props;
  const router = useRouter();
  const [user, loading, error] = useAuthState(auth);
  const { t } = useLocale();

  if (!router.isReady || loading) {
    return <Loading />;
  }

  if (error) {
    return <SomethingWentWrong />;
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
        <title>{t.signIn}</title>
      </Head>
      <Container py={{ base: "12", md: "24" }}>
        <VStack>
          <Heading>TraPay</Heading>
          <Text>{t.appDescription}</Text>
          <Box h="8" />
          <SignInButton />
          <Box h="8" />
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
