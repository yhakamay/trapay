import { CalendarIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { collection, doc } from "firebase/firestore";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import CopyToClipboardButton from "../../components/atoms/copy_to_clipboard_button";
import EventDate from "../../components/atoms/event_date";
import Loading from "../../components/atoms/loading";
import TotalCard from "../../components/molecules/total_card";
import NewPaymentForm from "../../components/organisms/new_payment_form";
import PaymentsList from "../../components/organisms/payments_list";
import { auth, db } from "../../firebaseConfig";
import { eventConverter } from "../../types/event";
import { User, userConverter } from "../../types/user";

type EventDetailsProps = {
  id: string;
};

export default function EventDetails(props: EventDetailsProps) {
  const { id } = props;
  const router = useRouter();
  const [user] = useAuthState(auth);
  const eventsRef = collection(db, "events");
  const eventRef = doc(eventsRef, id).withConverter(eventConverter);
  const [event, loading, error] = useDocumentData(eventRef);
  const membersRef = collection(eventRef, "members").withConverter(
    userConverter
  );
  const [members] = useCollectionData(membersRef);
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true });

  if (!router.isReady || loading) {
    return <Loading />;
  }

  if (!user) {
    router.push(`/login?e=${id}`);
  }

  if (error || !event) {
    return (
      <Center>
        <Text>Something went wrong.</Text>
      </Center>
    );
  }

  // check if members contain user
  members?.some((member) => {
    const isMember = member.id === user?.uid;

    if (isMember && isOpen) {
      onClose();
    }
  });

  return (
    <>
      <Head>
        <title>{event.title}</title>
      </Head>
      <Modal
        isOpen={isOpen}
        isCentered={true}
        onClose={onClose}
        closeOnOverlayClick={false}
        closeOnEsc={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Join this event?</ModalHeader>
          <ModalBody>{"You're invited! Join the event first."}</ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Center>
        <Box w={{ base: "sm", md: "lg" }}>
          <VStack spacing="4">
            <HStack w="full" justify="space-between">
              <Heading>{event.title}</Heading>
              <Spacer />
              <CalendarIcon color="grey" />
              <EventDate date={new Date(event.date ?? "")} />
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
