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
  Stack,
  MenuDivider,
  useDisclosure,
  Heading,
} from "@chakra-ui/react";
import { addDoc, collection, DocumentReference } from "firebase/firestore";
import { useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { MdAdd, MdExpandMore } from "react-icons/md";
import { useLocale } from "../../../locale";
import { Event } from "../../types/event";
import { Payment, paymentConverter } from "../../types/payment";
import { User, userConverter } from "../../types/user";
import NewMemberModal from "./new_member_modal";

type NewPaymentFormProps = {
  eventRef: DocumentReference<Event>;
};

export default function NewPaymentForm(props: NewPaymentFormProps) {
  const { eventRef } = props;
  const [newPaymentTitle, setNewPaymentTitle] = useState<string | null>(null);
  const [newPaymentAmount, setNewPaymentAmount] = useState<number | null>(null);
  const [newPaymentBy, setNewPaymentBy] = useState<User | null>(null);
  const paymentsRef = collection(eventRef, "payments").withConverter(
    paymentConverter
  );
  const membersRef = collection(eventRef, "members").withConverter(
    userConverter
  );
  const [members, loading] = useCollectionData(membersRef);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t } = useLocale();

  if (loading) {
    return null;
  }

  return (
    <>
      <NewMemberModal isOpen={isOpen} onClose={onClose} eventRef={eventRef} />
      <Box w={{ base: "sm", md: "lg" }}>
        <Card variant="outline">
          <CardBody>
            <Stack spacing="4">
              <Heading size="sm">{t.newPayment}</Heading>
              <HStack spacing="4">
                <VStack w="full">
                  <Input
                    size="sm"
                    onChange={(e) => setNewPaymentTitle(e.target.value)}
                    value={newPaymentTitle ?? ""}
                    placeholder={t.title}
                  />
                  <HStack spacing="4" w="full">
                    <Input
                      size="sm"
                      onChange={(e) =>
                        setNewPaymentAmount(Number(e.target.value))
                      }
                      value={newPaymentAmount ?? ""}
                      placeholder={t.amount}
                      type="number"
                    />
                    <Menu>
                      <MenuButton
                        w="full"
                        as={Button}
                        size="sm"
                        rightIcon={<MdExpandMore />}
                        variant="outline"
                      >
                        {newPaymentBy?.name ?? t.paidBy}
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
                        <MenuDivider />
                        <MenuItem
                          icon={<MdAdd />}
                          onClick={() => {
                            onOpen();
                          }}
                        >
                          {t.addMember}
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </HStack>
                </VStack>
                <IconButton
                  size="lg"
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
    </>
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
    setNewPaymentBy(null);
    setNewPaymentAmount(null);

    await addDoc(paymentsRef, payment);
  }
}
