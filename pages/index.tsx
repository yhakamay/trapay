import Head from "next/head";
import NextImage from "next/image";
import {
  Box,
  Center,
  Container,
  Heading,
  Image,
  Spacer,
  Spinner,
  Text,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import EventCard from "../components/molecules/event_card";
import { SignInButton } from "../components/molecules/sign_in_button";
import { auth, db } from "../firebaseConfig";
import { collection, doc } from "firebase/firestore";
import { eventConverter } from "../types/event";

export default function Home() {
  const [user] = useAuthState(auth);
  const usersRef = collection(db, "users");
  const userRef = user ? doc(usersRef, user.uid) : null;
  const eventsRef = userRef
    ? collection(userRef, "events").withConverter(eventConverter)
    : null;
  const [events, loading, error] = useCollectionData(eventsRef);
  const noEvents = events?.length === 0;

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

  if (loading) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  if (error) {
    return (
      <Center>
        <Text>{error.message}</Text>
      </Center>
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
        {noEvents ? (
          <VStack>
            <NextImage
              src="/void.svg"
              alt="no events"
              width="300"
              height="300"
            />
            <Box h="8" />
            <Text>No events yet. Add one!</Text>
          </VStack>
        ) : (
          <Wrap justify="center">
            {events?.map((event) => (
              <WrapItem key={event.id}>
                <EventCard
                  id={event.id?.toString() ?? ""}
                  title={event.title}
                  date={event.date ?? ""}
                  description={event.description ?? ""}
                />
              </WrapItem>
            ))}
          </Wrap>
        )}
      </Box>
    </>
  );
}
