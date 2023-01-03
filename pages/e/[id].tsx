import { CalendarIcon } from "@chakra-ui/icons";
import {
  Box,
  Center,
  Heading,
  HStack,
  Spacer,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { collection, doc } from "firebase/firestore";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useDocumentData } from "react-firebase-hooks/firestore";
import CopyToClipboardButton from "../../components/atoms/copy_to_clipboard_button";
import TotalCard from "../../components/molecules/total_card";
import NewPaymentForm from "../../components/organisms/new_payment_form";
import PaymentsList from "../../components/organisms/payments_list";
import { db } from "../../firebaseConfig";
import { eventConverter } from "../../types/event";

type EventDetailsProps = {
  id: string;
};

export default function EventDetails(props: EventDetailsProps) {
  const { id } = props;
  const eventsRef = collection(db, "events");
  const eventRef = doc(eventsRef, id).withConverter(eventConverter);
  const [event, loading, error] = useDocumentData(eventRef);
  const formattedDate = new Date(event?.date ?? "").toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  if (loading) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  if (error || !event) {
    return (
      <Center>
        <Text>Something went wrong.</Text>
      </Center>
    );
  }

  return (
    <>
      <Head>
        <title>{event.title}</title>
      </Head>
      <Center>
        <Box w={{ base: "sm", md: "lg" }}>
          <VStack spacing="4">
            <HStack w="full" justify="space-between">
              <Heading>{event.title}</Heading>
              <Spacer />
              <CalendarIcon color="grey" />
              <Text color="grey" fontSize="sm">
                {formattedDate}
              </Text>
            </HStack>
            <Text alignSelf="start">{event.description}</Text>
            <HStack w="full" justify="end">
              <CopyToClipboardButton eventId={event.id!} />
            </HStack>
            <TotalCard eventRef={eventRef} />
            <NewPaymentForm eventRef={eventRef} />
            <PaymentsList eventRef={eventRef} />
          </VStack>
        </Box>
      </Center>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.params?.id as string;
  return { props: { id } };
};
