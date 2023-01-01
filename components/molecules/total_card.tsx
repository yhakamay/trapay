import { Card, VStack, Spacer, Heading, Text } from "@chakra-ui/react";
import { Payment } from "../../types/payment";

type TotalCardProps = {
  payments: Payment[];
};

export default function TotalCard(props: TotalCardProps) {
  const { payments } = props;

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
