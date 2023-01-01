import Head from "next/head";
import {
  Box,
  Container,
  Heading,
  Image,
  Text,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { events } from "../events";
import EventCard from "../components/molecules/event_card";
import { SignInButton } from "../components/molecules/sign_in_button";
import { auth } from "../firebaseConfig";

export default function Home() {
  const [user] = useAuthState(auth);

  if (!user) {
    return (
      <>
        <Container py={{ base: "12", md: "24" }}>
          <VStack spacing="8">
            <Heading>TraPay</Heading>
            <Text>Split the bill with your friends easily!</Text>
            <SignInButton />
            <Image src="/hello.svg" alt="hello" boxSize="300px" />
          </VStack>
        </Container>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>TraPay</title>
        <meta
          name="description"
          content="Split the bill with your friends easily!"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box px={{ base: "4", md: "8" }}>
        <Wrap justify="center">
          {events.map((event) => (
            <>
              <WrapItem>
                <EventCard
                  key={event.id}
                  id={event.id?.toString() ?? ""}
                  title={event.title}
                  createdAt={event.createdAt ?? ""}
                  description={event.description ?? ""}
                />
              </WrapItem>
            </>
          ))}
        </Wrap>
      </Box>
    </>
  );
}
