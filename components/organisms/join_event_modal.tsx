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
  deleteDoc,
  doc,
  DocumentReference,
  setDoc,
} from "firebase/firestore";
import { User as FirebaseUser } from "firebase/auth";
import { Event } from "../../types/event";
import { User } from "../../types/user";
import { useState } from "react";
import UserTag from "../atoms/user_tag";
import { AddIcon, ArrowForwardIcon, ChevronDownIcon } from "@chakra-ui/icons";

type JoinEventModalProps = {
  eventRef: DocumentReference<Event>;
  isOpen: boolean;
  onClose: () => void;
  firebaseUser: FirebaseUser;
  members: Array<User>;
};

export default function JoinEventModal(props: JoinEventModalProps) {
  const { eventRef, isOpen, onClose, firebaseUser, members } = props;
  const srcUser = convertToUser(firebaseUser ?? null);
  const [dstUser, setDstUser] = useState<User | null>(srcUser ?? null);

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
                user={srcUser!}
                deletable={false}
                onDelete={function (): void {
                  throw new Error("Function not implemented.");
                }}
              />
              <ArrowForwardIcon />
              <Menu isLazy>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                  {dstUser?.name}
                </MenuButton>
                <MenuList>
                  <RadioGroup
                    onChange={(value: string): void => {
                      const selectedUser = members.find(
                        (member) => member.id === value
                      );
                      setDstUser(selectedUser ?? srcUser);
                    }}
                    value={dstUser?.id ?? srcUser?.id!}
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
                      <Radio value={srcUser?.id!}>
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
              await replaceMember(eventRef, srcUser!, dstUser!);
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
      name: firebaseUser.displayName ?? "",
      email: firebaseUser.email ?? "",
      photoURL: firebaseUser.photoURL ?? "",
    };
  }

  async function replaceMember(
    eventRef: DocumentReference<Event>,
    srcUser: User,
    dstUser: User
  ) {
    const membersRef = collection(eventRef, "members");

    if (srcUser.id === dstUser.id) {
      // Just add user to members
      await setDoc(doc(membersRef, srcUser.id!), srcUser, { merge: true });
    } else {
      // Replace dstUser with srcUser
      await setDoc(doc(membersRef, srcUser.id!), srcUser, { merge: true });
      const dstUserRef = doc(membersRef, dstUser.id!);
      await deleteDoc(dstUserRef);
    }
  }
}
