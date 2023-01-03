import { Card, VStack, Spacer, Heading, Text } from "@chakra-ui/react";
import { collection, DocumentReference } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Event } from "../../types/event";
import { Payment, paymentConverter } from "../../types/payment";

type TotalCardProps = {
  eventRef: DocumentReference<Event>;
};

export default function TotalCard(props: TotalCardProps) {
  const { eventRef } = props;
  const paymentsRef = collection(eventRef, "payments").withConverter(
    paymentConverter
  );
  const [payments, loadingPayments] = useCollectionData(paymentsRef);

  return (
    <Card w={{ base: "sm", md: "lg" }}>
      <VStack>
        <Spacer />
        <Text>Total</Text>
        <Heading size="lg">{getTotal()}</Heading>
        <Spacer />
      </VStack>
    </Card>
  );

  function getTotal() {
    return payments?.reduce((acc, payment) => acc + payment.amount, 0);
  }
}
