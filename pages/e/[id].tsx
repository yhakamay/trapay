import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Avatar,
  Box,
  Button,
  Card,
  Center,
  Heading,
  HStack,
  IconButton,
  Spacer,
  Spinner,
  StackDivider,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { collection, doc } from "firebase/firestore";
import { GetServerSideProps } from "next";
import { useRef } from "react";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import { db } from "../../firebaseConfig";
import { eventConverter } from "../../types/event";

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
  const paymentsRef = collection(eventRef, "payments");
  const [payments, loadingPayments] = useCollectionData(paymentsRef);

  if (loading) {
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
                  <Avatar boxSize="10"></Avatar>
                  <Spacer />
                  <Text>{payment.title}</Text>
                  <Spacer />
                  <Heading size="lg">{payment.amount}</Heading>
                  <AlertDialog
                    isOpen={isOpen}
                    leastDestructiveRef={cancelRef}
                    onClose={onClose}
                  >
                    <AlertDialogOverlay>
                      <AlertDialogContent>
                        <AlertDialogHeader>Delete payment</AlertDialogHeader>
                        <AlertDialogBody>
                          {"Are you sure? You can't undo this action."}
                        </AlertDialogBody>
                        <AlertDialogFooter>
                          <Button onClick={onClose}>Cancel</Button>
                          <Button
                            colorScheme="red"
                            onClick={() => {
                              deletePayment(payment.id);
                              onClose();
                            }}
                            ml={3}
                          >
                            Delete
                          </Button>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialogOverlay>
                  </AlertDialog>
                  <IconButton
                    onClick={onOpen}
                    aria-label={"delete"}
                    variant="ghost"
                    color="tomato"
                    icon={<DeleteIcon />}
                  />
                </HStack>
              </Box>
            ))}
          </VStack>
          <Button w="full" leftIcon={<AddIcon />}>
            Add
          </Button>
        </VStack>
      </Box>
    </Center>
  );

  function getTotal() {
    return payments?.reduce((acc, payment) => acc + payment.amount, 0);
  }

  function deletePayment(id: string) {
    console.log(id);
  }
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.params?.id as string;
  return { props: { id } };
};
