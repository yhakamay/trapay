import { Box, Center, Heading, VStack } from "@chakra-ui/react";

import Head from "next/head";
import NextImage from "next/image";
import router from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import Loading from "../components/atoms/loading";
import NewEventForm from "../components/organisms/new_event_form";
import { auth } from "../firebaseConfig";

export default function NewEvent() {
  const [user, loadingUser] = useAuthState(auth);

  if (loadingUser) {
    return <Loading />;
  }

  if (!user) {
    router.push("/login");
  }

  return (
    <>
      <Head>
        <title>New Event</title>
      </Head>
      <Center>
        <Box w={{ base: "sm", md: "lg" }}>
          <VStack spacing="4">
            <Heading size="lg">Add new event</Heading>
            <NextImage
              src="/new.svg"
              alt={"new event"}
              width="200"
              height="200"
            />
            <NewEventForm firebaseUser={user!} />
          </VStack>
        </Box>
      </Center>
    </>
  );
}
