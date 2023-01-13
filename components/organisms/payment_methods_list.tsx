import {
  Card,
  CardBody,
  Heading,
  HStack,
  IconButton,
  Link,
  Text,
  VStack,
} from "@chakra-ui/react";
import { CollectionReference, deleteDoc, doc } from "firebase/firestore";
import { MdDelete } from "react-icons/md";
import { PaymentMethod } from "../../types/payment_method";

type PaymentMethodsListProps = {
  methodsRef: CollectionReference<PaymentMethod>;
  methods: PaymentMethod[];
};

export function PaymentMethodsList(props: PaymentMethodsListProps) {
  const { methodsRef, methods } = props;

  return methods?.map((method) => {
    return (
      <Card key={method.name} w={{ base: "sm", md: "lg" }} variant="outline">
        <CardBody>
          <HStack justify="space-between">
            <VStack alignItems="start">
              <Heading size="sm">{method.name}</Heading>
              <Text>{method.description}</Text>
              {method.url && (
                <Link href={method.url} isExternal>
                  {method.url}
                </Link>
              )}
            </VStack>
            <IconButton
              onClick={async () => {
                await onClickDeleteMethod(methodsRef, method.id!);
              }}
              variant="ghost"
              color="red"
              icon={<MdDelete />}
              aria-label={"delete method"}
            />
          </HStack>
        </CardBody>
      </Card>
    );
  });

  async function onClickDeleteMethod(
    methodsRef: CollectionReference<PaymentMethod>,
    methodId: string
  ) {
    await deleteDoc(doc(methodsRef, methodId));
  }
}
