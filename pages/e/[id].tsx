import { AddIcon, ChevronDownIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Card,
  Center,
  Heading,
  HStack,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Spinner,
  StackDivider,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { addDoc, collection, deleteDoc, doc } from "firebase/firestore";
import { GetServerSideProps } from "next";
import { useRef, useState } from "react";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import { db } from "../../firebaseConfig";
import { eventConverter } from "../../types/event";
import { Payment, paymentConverter } from "../../types/payment";
import { User, userConverter } from "../../types/user";

type EventDetailsProps = {
  id: string;
};

export default function EventDetails(props: EventDetailsProps) {
  const { id } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const eventsRef = collection(db, "events");
  const eventRef = doc(eventsRef, id).withConverter(eventConverter);
  const [event, loading, error] = useDocumentData(eventRef);
  const membersRef = collection(eventRef, "members").withConverter(
    userConverter
  );
  const [members, loadingMembers] = useCollectionData(membersRef);
  const paymentsRef = collection(eventRef, "payments").withConverter(
    paymentConverter
  );
  const [payments, loadingPayments] = useCollectionData(paymentsRef);
  const [newPaymentTitle, setNewPaymentTitle] = useState("");
  const [newPaymentAmount, setNewPaymentAmount] = useState<number>(0);
  const [newPaymentBy, setNewPaymentBy] = useState<User>();

  if (loading || loadingMembers || loadingPayments) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  if (error || !event) {
    return (
      <Center>
        <Text>Something went wrong.</Text>
      </Center>
    );
  }

  return (
    <Center>
      <Box w={{ base: "sm", md: "lg" }}>
        <VStack spacing="4">
          <Heading>{event.title}</Heading>
          <Text>{event.description}</Text>
          <Card w={{ base: "sm", md: "lg" }}>
            <VStack>
              <Spacer />
              <Text>Total</Text>
              <Heading size="lg">{getTotal()}</Heading>
              <Spacer />
            </VStack>
          </Card>
          <VStack divider={<StackDivider />} spacing="4">
            {payments?.map((payment) => (
              <Box key={payment.id} w={{ base: "sm", md: "lg" }}>
                <HStack spacing="4">
                  <Avatar
                    src={payment.paidBy.photoURL ?? undefined}
                    name={payment.paidBy.name}
                    boxSize="10"
                  ></Avatar>
                  <Spacer />
                  <Text>{payment.title}</Text>
                  <Spacer />
                  <Heading size="lg">{payment.amount}</Heading>
                  <IconButton
                    onClick={() => deletePayment(payment.id!)}
                    aria-label={"delete"}
                    variant="ghost"
                    color="tomato"
                    icon={<DeleteIcon />}
                  />
                </HStack>
              </Box>
            ))}
            <Box w={{ base: "sm", md: "lg" }}>
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
                      value={newPaymentAmount}
                      placeholder="Amount"
                      type="number"
                    />
                    <Menu>
                      <MenuButton
                        w="full"
                        as={Button}
                        rightIcon={<ChevronDownIcon />}
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
                  icon={<AddIcon />}
                  onClick={addPayment}
                  aria-label={"add"}
                />
              </HStack>
            </Box>
          </VStack>
        </VStack>
      </Box>
    </Center>
  );

  function getTotal() {
    return payments?.reduce((acc, payment) => acc + payment.amount, 0);
  }

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

  function deletePayment(id: string) {
    const paymentRef = doc(paymentsRef, id);
    deleteDoc(paymentRef);
  }
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.params?.id as string;
  return { props: { id } };
};
