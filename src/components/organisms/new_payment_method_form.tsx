import {
  Card,
  CardHeader,
  Heading,
  CardBody,
  HStack,
  VStack,
  Input,
  Textarea,
  IconButton,
} from "@chakra-ui/react";
import { CollectionReference, addDoc } from "firebase/firestore";
import { useState } from "react";
import { MdAdd } from "react-icons/md";
import { useLocale } from "../../../locale";
import { PaymentMethod } from "../../types/payment_method";

type NewPaymentMethodFormProps = {
  methodsRef: CollectionReference<PaymentMethod>;
};

export default function NewPaymentMethodForm(props: NewPaymentMethodFormProps) {
  const { methodsRef } = props;
  const [methodName, setMethodName] = useState("");
  const [methodDescription, setMethodDescription] = useState("");
  const [methodUrl, setMethodUrl] = useState("");
  const { t } = useLocale();

  return (
    <Card variant="outline">
      <CardHeader>
        <Heading size="sm">{t.addPaymentMethod}</Heading>
      </CardHeader>
      <CardBody>
        <HStack spacing="4">
          <VStack w="full">
            <Input
              size="sm"
              value={methodName}
              placeholder={t.title}
              maxLength={20}
              onChange={(e) => {
                setMethodName(e.target.value);
              }}
            />
            <Input
              size="sm"
              value={methodUrl}
              placeholder={t.url}
              maxLength={100}
              onChange={(e) => {
                setMethodUrl(e.target.value);
              }}
            />
            <Textarea
              size="sm"
              value={methodDescription}
              placeholder={`${t.description} (${t.optional})`}
              maxLength={100}
              resize="none"
              onChange={(e) => {
                setMethodDescription(e.target.value);
              }}
            />
          </VStack>
          <IconButton
            size="sm"
            onClick={() => {
              onClickAddMethod({
                name: methodName,
                url: methodUrl,
                description: methodDescription,
                default: false,
              });
            }}
            disabled={!methodName}
            icon={<MdAdd />}
            aria-label={"add"}
          />
        </HStack>
      </CardBody>
    </Card>
  );

  function onClickAddMethod(newMethod: PaymentMethod) {
    if (!newMethod.name) {
      return;
    }

    addMethod(methodsRef!, newMethod);

    setMethodName("");
    setMethodUrl("");
    setMethodDescription("");
  }

  async function addMethod(
    methodsRef: CollectionReference<PaymentMethod>,
    method: PaymentMethod
  ) {
    await addDoc(methodsRef, method);
  }
}
