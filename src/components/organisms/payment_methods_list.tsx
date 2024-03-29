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
              {url && (
                <Link href={url} isExternal>
                  <Text
                    fontSize="xs"
                    decoration="underline"
                    noOfLines={1}
                    textOverflow="ellipsis"
                  >
                    {removeScheme(url)}
                  </Text>
                </Link>
              )}
              {description && (
                <Text fontSize="xs" color="grey">
                  {description}
                </Text>
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
            />
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
