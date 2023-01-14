import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  VStack,
  Wrap,
  WrapItem,
  Box,
  Tag,
  TagLeftIcon,
  HStack,
  Divider,
  Text,
} from "@chakra-ui/react";
import {
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  DocumentReference,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { User as FirebaseUser } from "firebase/auth";
import { Event } from "../../types/event";
import { User } from "../../types/user";
import { useState } from "react";
import UserTag from "../atoms/user_tag";
import { Payment, paymentConverter } from "../../types/payment";
import { MdPersonAdd } from "react-icons/md";

type JoinEventModalProps = {
  eventRef: DocumentReference<Event>;
  isOpen: boolean;
  onClose: () => void;
  firebaseUser: FirebaseUser;
  members: Array<User>;
};

export default function JoinEventModal(props: JoinEventModalProps) {
  const { eventRef, isOpen, onClose, firebaseUser, members } = props;
  const newUser = convertToUser(firebaseUser ?? null);
  const [oldUser, setOldUser] = useState<User | null>(null);

  if (!firebaseUser) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      isCentered={true}
      onClose={onClose}
      closeOnOverlayClick={false}
      closeOnEsc={false}
    >
      <ModalOverlay
        bg="blackAlpha.300"
        backdropFilter="blur(10px) hue-rotate(90deg)"
      />
      <ModalContent>
        <ModalHeader>Select yourself</ModalHeader>
        <ModalBody>
          <VStack>
            <Wrap justify="center">
              {members.map((member) => {
                const alreadyAssigned = member.email !== null;

                return (
                  <>
                    <WrapItem>
                      <UserTag
                        key={member.id}
                        user={member}
                        deletable={false}
                        onClick={() => {
                          if (!alreadyAssigned) {
                            setOldUser(member);
                          }
                        }}
                        selected={oldUser?.id === member.id}
                        disabled={alreadyAssigned}
                      />
                    </WrapItem>
                  </>
                );
              })}
            </Wrap>
            <Box bg="bg-surface" w="full">
              <HStack>
                <Divider />
                <Text fontSize="xs" whiteSpace="nowrap">
                  or
                </Text>
                <Divider />
              </HStack>
            </Box>
            <Tag
              size="md"
              colorScheme="green"
              borderRadius="full"
              variant={oldUser?.id === newUser?.id ? "solid" : "outline"}
              cursor="pointer"
              onClick={() => {
                setOldUser(newUser);
              }}
            >
              <TagLeftIcon as={MdPersonAdd} />
              Not found? Add yourself!
            </Tag>
            <Box h="1" />
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button
            disabled={oldUser === null}
            onClick={async () => {
              await replaceMember(eventRef, newUser!, oldUser!);
              onClose();
            }}
          >
            Join
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

  function convertToUser(firebaseUser: FirebaseUser | null): User | null {
    if (!firebaseUser) {
      return null;
    }

    return {
      id: firebaseUser.uid,
      name: firebaseUser.displayName ?? "",
      email: firebaseUser.email ?? "",
      photoURL: firebaseUser.photoURL ?? "",
    };
  }

  async function replaceMember(
    eventRef: DocumentReference<Event>,
    newUser: User,
    oldUser: User
  ) {
    const membersRef = collection(eventRef, "members");

    if (newUser.id === oldUser.id) {
      // Just add user to members
      await setDoc(doc(membersRef, newUser.id!), newUser, { merge: true });
    } else {
      await setDoc(doc(membersRef, newUser.id!), newUser, { merge: true });
      const paymentsRef = collection(eventRef, "payments").withConverter(
        paymentConverter
      );
      await updatePaidBy(paymentsRef, newUser, oldUser);
      const oldUserRef = doc(membersRef, oldUser.id!);
      await deleteDoc(oldUserRef);
    }
  }

  async function updatePaidBy(
    paymentsRef: CollectionReference<Payment>,
    newUser: User,
    oldUser: User
  ) {
    const paymentsSnapshot = await getDocs(paymentsRef);

    for (const paymentDoc of paymentsSnapshot.docs) {
      const payment = paymentDoc.data();

      if (payment.paidBy?.id === oldUser.id) {
        await updateDoc(paymentDoc.ref, {
          paidBy: newUser,
        });
      }
    }
  }
}
