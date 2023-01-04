import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  VStack,
  HStack,
  Box,
  Menu,
  MenuButton,
  MenuList,
  Radio,
  RadioGroup,
  Divider,
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
import { AddIcon, ArrowForwardIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Payment, paymentConverter } from "../../types/payment";

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
  const [oldUser, setOldUser] = useState<User | null>(newUser ?? null);

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
        <ModalHeader>Join this event?</ModalHeader>
        <ModalBody>
          <VStack>
            <Text alignSelf="start">
              {
                "You're invited! Assign yourself first. If you don't find your name, select \"Create\". You cannot select a name that's already assigned to someone. "
              }
            </Text>
            <Box h="4" />
            <HStack>
              <UserTag
                user={newUser!}
                deletable={false}
                onDelete={function (): void {
                  throw new Error("Function not implemented.");
                }}
              />
              <ArrowForwardIcon />
              <Menu isLazy>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                  {oldUser?.name}
                </MenuButton>
                <MenuList>
                  <RadioGroup
                    onChange={(value: string): void => {
                      const selectedUser = members.find(
                        (member) => member.id === value
                      );
                      setOldUser(selectedUser ?? newUser);
                    }}
                    value={oldUser?.id ?? newUser?.id!}
                  >
                    <VStack align="start" pl="2" overflow="hidden">
                      {members.map((member) => {
                        const alreadyAssigned = member.email !== null;

                        return (
                          <Radio
                            key={member.id}
                            value={member.id!}
                            isDisabled={alreadyAssigned}
                          >
                            <UserTag
                              user={member}
                              deletable={false}
                              onDelete={function (): void {
                                throw new Error("Function not implemented.");
                              }}
                            />
                          </Radio>
                        );
                      })}
                      <Divider />
                      <Radio value={newUser?.id!}>
                        <HStack>
                          <AddIcon />
                          <Text>Create</Text>
                        </HStack>
                      </Radio>
                    </VStack>
                  </RadioGroup>
                </MenuList>
              </Menu>
            </HStack>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button
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
