import { DeleteIcon } from "@chakra-ui/icons";
import {
  VStack,
  StackDivider,
  HStack,
  Avatar,
  Spacer,
  Heading,
  IconButton,
  Box,
  Text,
  Center,
  Spinner,
} from "@chakra-ui/react";
import {
  collection,
  deleteDoc,
  doc,
  DocumentReference,
} from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Event } from "../../types/event";
import { paymentConverter } from "../../types/payment";

type PaymentsListProps = {
  eventRef: DocumentReference<Event>;
};

export default function PaymentsList(props: PaymentsListProps) {
  const { eventRef } = props;
  const paymentsRef = collection(eventRef, "payments").withConverter(
    paymentConverter
  );
  const [payments, loadingPayments] = useCollectionData(paymentsRef);

  if (loadingPayments) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  return (
    <VStack divider={<StackDivider />} spacing="4">
      {payments?.map((payment) => (
        <Box key={payment.id} w={{ base: "sm", md: "lg" }}>
          <HStack spacing="4">
            <Avatar
              src={payment.paidBy.photoURL ?? undefined}
              name={payment.paidBy.name}
              boxSize="10"
            ></Avatar>
            <Spacer />
            <Text>{payment.title}</Text>
            <Spacer />
            <Heading size="lg">{payment.amount}</Heading>
            <IconButton
              onClick={() => deletePayment(payment.id!)}
              aria-label={"delete"}
              variant="ghost"
              color="tomato"
              icon={<DeleteIcon />}
            />
          </HStack>
        </Box>
      ))}
    </VStack>
  );

  async function deletePayment(id: string) {
    const paymentRef = doc(paymentsRef, id);
    await deleteDoc(paymentRef);
  }
}
