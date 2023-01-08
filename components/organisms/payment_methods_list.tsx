import { Card, CardBody, Heading, Link, Text } from "@chakra-ui/react";
import { PaymentMethod } from "../../types/payment_method";

type PaymentMethodsListProps = {
  methods: PaymentMethod[];
};

export function PaymentMethodsList(props: PaymentMethodsListProps) {
  const { methods } = props;

  return methods?.map((method) => {
    return (
      <Card key={method.name} w={{ base: "sm", md: "lg" }} variant="outline">
        <CardBody>
          <Heading size="sm">{method.name}</Heading>
          <Text>{method.description}</Text>
          <Link href={method.url ?? ""} isExternal />
        </CardBody>
      </Card>
    );
  });
}
