import Head from "next/head";
import NextImage from "next/image";
import {
  Box,
  Center,
  Spinner,
  Text,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import EventCard from "../components/molecules/event_card";
import { auth, db } from "../firebaseConfig";
import { collection, doc } from "firebase/firestore";
import { eventConverter } from "../types/event";
import { useRouter } from "next/router";
import { userConverter } from "../types/user";

export default function Home() {
  const router = useRouter();
  const [user, loadingUser, errorUser] = useAuthState(auth);
  const usersRef = collection(db, "users").withConverter(userConverter);
  const userRef = user ? doc(usersRef, user.uid) : null;
  const eventsRef = userRef
    ? collection(userRef, "events").withConverter(eventConverter)
    : null;
  const [events, loadingEvents, errorEvents] = useCollectionData(eventsRef);
  const noEvents = events?.length === 0;

  if (!router.isReady || loadingUser || loadingEvents) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  if (!user) {
    router.push("/login");
  }

  if (errorUser || errorEvents) {
    return (
      <Center>
        <Text>Something went wrong</Text>
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
