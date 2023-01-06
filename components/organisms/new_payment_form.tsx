import {
  HStack,
  VStack,
  Input,
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
  Avatar,
  IconButton,
  Box,
  Card,
  CardBody,
  Heading,
  Stack,
} from "@chakra-ui/react";
import { addDoc, collection, DocumentReference } from "firebase/firestore";
import { useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { MdAdd, MdExpandMore } from "react-icons/md";
import { Event } from "../../types/event";
import { Payment, paymentConverter } from "../../types/payment";
import { User, userConverter } from "../../types/user";

type NewPaymentFormProps = {
  eventRef: DocumentReference<Event>;
};

export default function NewPaymentForm(props: NewPaymentFormProps) {
  const { eventRef } = props;
  const [newPaymentTitle, setNewPaymentTitle] = useState("");
  const [newPaymentAmount, setNewPaymentAmount] = useState<number>(0);
  const [newPaymentBy, setNewPaymentBy] = useState<User>();
  const paymentsRef = collection(eventRef, "payments").withConverter(
    paymentConverter
  );
  const membersRef = collection(eventRef, "members").withConverter(
    userConverter
  );
  const [members, loading] = useCollectionData(membersRef);

  if (loading) {
    return null;
  }

  return (
    <Box w={{ base: "sm", md: "lg" }}>
      <Card variant="outline">
        <CardBody>
          <Stack spacing="4">
            <Heading size="sm">New payment</Heading>
            <HStack spacing="4">
              <VStack w="full">
                <Input
                  onChange={(e) => setNewPaymentTitle(e.target.value)}
                  value={newPaymentTitle}
                  placeholder="Title"
                />
                <HStack spacing="4" w="full">
                  <Input
                    onChange={(e) =>
                      setNewPaymentAmount(Number(e.target.value))
                    }
                    value={newPaymentAmount || undefined}
                    placeholder="Amount"
                    type="number"
                  />
                  <Menu>
                    <MenuButton
                      w="full"
                      as={Button}
                      rightIcon={<MdExpandMore />}
                      variant="outline"
                    >
                      Paid by
                    </MenuButton>
                    <MenuList>
                      {members?.map((member) => (
                        <MenuItem
                          key={member.id}
                          onClick={() => setNewPaymentBy(member)}
                        >
                          <Avatar
                            size="sm"
                            src={member.photoURL ?? undefined}
                            name={member.name}
                            mr="2"
                          />
                          {member.name}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </Menu>
                </HStack>
              </VStack>
              <IconButton
                disabled={
                  !newPaymentTitle || !newPaymentAmount || !newPaymentBy
                }
                icon={<MdAdd />}
                onClick={addPayment}
                aria-label={"add"}
              />
            </HStack>
          </Stack>
        </CardBody>
      </Card>
    </Box>
  );

  async function addPayment() {
    if (!newPaymentTitle || !newPaymentAmount || !newPaymentBy) {
      return;
    }

    const payment: Payment = {
      title: newPaymentTitle,
      amount: newPaymentAmount,
      paidBy: newPaymentBy,
    };

    setNewPaymentTitle("");
    setNewPaymentAmount(0);

    await addDoc(paymentsRef, payment);
  }
}
