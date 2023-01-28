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
    const { name, description, url, id } = method;

    return (
      <Card key={id} w={{ base: "sm", md: "lg" }} variant="outline">
        <CardBody>
          <HStack justify="space-between">
            <VStack alignItems="start">
              <Heading size="sm">{name}</Heading>
              <Text>{description}</Text>
              {url && (
                <Link href={url} isExternal>
                  {removeScheme(url).length > 30
                    ? removeScheme(url).slice(0, 30) + "..."
                    : removeScheme(url)}
                </Link>
              )}
            </VStack>
            <IconButton
              onClick={async () => {
                await onClickDeleteMethod(methodsRef, id!);
              }}
              variant="ghost"
              color="red"
              icon={<MdDelete />}
              aria-label={"delete method"}
            >
              <Text>Delete</Text>
            </IconButton>
          </HStack>
        </CardBody>
      </Card>
    );
  });

  function removeScheme(url: string) {
    return url.replace(/.*?:\/\//g, "");
  }

  async function onClickDeleteMethod(
    methodsRef: CollectionReference<PaymentMethod>,
    methodId: string
  ) {
    await deleteDoc(doc(methodsRef, methodId));
  }
}
