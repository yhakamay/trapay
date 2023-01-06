import {
  VStack,
  StackDivider,
  HStack,
  Avatar,
  Spacer,
  IconButton,
  Box,
  Text,
} from "@chakra-ui/react";
import {
  collection,
  deleteDoc,
  doc,
  DocumentReference,
} from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { MdDelete } from "react-icons/md";
import { Event } from "../../types/event";
import { paymentConverter } from "../../types/payment";
import Loading from "../atoms/loading";

type PaymentsListProps = {
  eventRef: DocumentReference<Event>;
};

export default function PaymentsList(props: PaymentsListProps) {
  const { eventRef } = props;
  const paymentsRef = collection(eventRef, "payments").withConverter(
    paymentConverter
  );
  const [payments, loading] = useCollectionData(paymentsRef);

  if (loading) {
    return <Loading />;
  }

  return (
    <VStack divider={<StackDivider />} spacing="4">
      {payments?.map((payment) => (
        <Box key={payment.id} w={{ base: "sm", md: "lg" }} px="20px">
          <HStack spacing="4">
            <Avatar
              src={payment.paidBy.photoURL ?? undefined}
              name={payment.paidBy.name}
              boxSize="10"
            ></Avatar>
            <Spacer />
            <Text>{payment.title}</Text>
            <Spacer />
            <Text fontWeight="bold">{payment.amount}</Text>
            <IconButton
              onClick={() => deletePayment(payment.id!)}
              aria-label={"delete"}
              variant="ghost"
              color="tomato"
              icon={<MdDelete />}
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
