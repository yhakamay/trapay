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
import { addDoc, collection, doc } from "firebase/firestore";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useState } from "react";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import CopyToClipboardButton from "../../components/atoms/copy_to_clipboard_button";
import TotalCard from "../../components/molecules/total_card";
import NewPaymentForm from "../../components/organisms/new_payment_form";
import PaymentsList from "../../components/organisms/payments_list";
import { db } from "../../firebaseConfig";
import { eventConverter } from "../../types/event";
import { Payment, paymentConverter } from "../../types/payment";
import { User, userConverter } from "../../types/user";

type EventDetailsProps = {
  id: string;
};

export default function EventDetails(props: EventDetailsProps) {
  const { id } = props;
  const eventsRef = collection(db, "events");
  const eventRef = doc(eventsRef, id).withConverter(eventConverter);
  const [event, loading, error] = useDocumentData(eventRef);
  const membersRef = collection(eventRef, "members").withConverter(
    userConverter
  );
  const [members, loadingMembers] = useCollectionData(membersRef);
  const paymentsRef = collection(eventRef, "payments").withConverter(
    paymentConverter
  );
  const [payments, loadingPayments] = useCollectionData(paymentsRef);
  const [newPaymentTitle, setNewPaymentTitle] = useState("");
  const [newPaymentAmount, setNewPaymentAmount] = useState<number>(0);
  const [newPaymentBy, setNewPaymentBy] = useState<User>();
  const formattedDate = new Date(event?.date ?? "").toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );
  const [copied, setCopied] = useState(false);

  if (loading || loadingMembers || loadingPayments) {
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
              <CopyToClipboardButton
                eventId={event.id!}
                copied={copied}
                setCopied={setCopied}
              />
            </HStack>
            <TotalCard payments={payments!} />
            <NewPaymentForm
              members={members!}
              setNewPaymentTitle={setNewPaymentTitle}
              setNewPaymentAmount={setNewPaymentAmount}
              setNewPaymentBy={setNewPaymentBy}
              newPaymentTitle={newPaymentTitle}
              newPaymentAmount={newPaymentAmount}
              addPayment={addPayment}
              newPaymentBy={newPaymentBy}
            />
            <PaymentsList payments={payments!} paymentsRef={paymentsRef} />
          </VStack>
        </Box>
      </Center>
    </>
  );

  async function addPayment() {
    if (!newPaymentTitle || !newPaymentAmount || !newPaymentBy) {
      return;
    }

    const payment: Payment = {
      title: newPaymentTitle,
      amount: newPaymentAmount,
      paidBy: newPaymentBy,
    };

    setNewPaymentTitle("");
    setNewPaymentAmount(0);

    await addDoc(paymentsRef, payment);
  }
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.params?.id as string;
  return { props: { id } };
};
