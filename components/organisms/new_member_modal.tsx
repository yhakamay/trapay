import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  InputGroup,
  Input,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import { DocumentReference, collection, addDoc } from "firebase/firestore";
import { useState } from "react";
import { Event } from "../../types/event";
import { User, userConverter } from "../../types/user";

type NewMemberModalProps = {
  isOpen: boolean;
  onClose: () => void;
  eventRef: DocumentReference<Event>;
};

export default function NewMemberModal(props: NewMemberModalProps) {
  const { isOpen, onClose, eventRef } = props;
  const [newMemberName, setNewMemberName] = useState("");

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add member</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <InputGroup>
            <Input
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              placeholder="Name"
            />
          </InputGroup>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClickAddMember} disabled={newMemberName === ""}>
            Add
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

  function onClickAddMember() {
    if (newMemberName === "") {
      return;
    }

    const newMember: User = {
      name: newMemberName,
      email: null,
      photoURL: null,
    };
    const membersRef = collection(eventRef, "members").withConverter(
      userConverter
    );

    addDoc(membersRef, newMember);

    onClose();
  }
}
