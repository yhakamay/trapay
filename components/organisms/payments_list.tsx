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
import { CollectionReference, deleteDoc, doc } from "firebase/firestore";
import { MdDelete } from "react-icons/md";
import { Payment } from "../../types/payment";

type PaymentsListProps = {
  paymentsRef: CollectionReference<Payment>;
  payments: Payment[];
};

export default function PaymentsList(props: PaymentsListProps) {
  const { paymentsRef, payments } = props;
  const intl = new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
  });

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
