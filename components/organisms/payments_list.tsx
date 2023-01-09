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
  const intl = new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
  });

  if (loading) {
    return <Loading />;
  }

  return (
    <VStack divider={<StackDivider />} spacing="4">
      {payments?.map((payment) => {
        const { id, title, amount, paidBy } = payment;
        const formattedAmount = intl.format(amount);

        return (
          <Box key={id} w={{ base: "sm", md: "lg" }} px="4">
            <HStack spacing="4">
              <Avatar
                src={paidBy.photoURL ?? undefined}
                name={paidBy.name}
                boxSize="10"
              ></Avatar>
              <Spacer />
              <Text>{title}</Text>
              <Spacer />
              <Text fontWeight="bold">{formattedAmount}</Text>
              <IconButton
                onClick={() => deletePayment(id!)}
                aria-label={"delete"}
                variant="ghost"
                color="tomato"
                icon={<MdDelete />}
              />
            </HStack>
          </Box>
        );
      })}
    </VStack>
  );

  async function deletePayment(id: string) {
    const paymentRef = doc(paymentsRef, id);
    await deleteDoc(paymentRef);
  }
}
