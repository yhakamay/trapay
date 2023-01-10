import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { CollectionReference, deleteDoc, doc } from "firebase/firestore";
import { Payment } from "../../types/payment";
import { User, userConverter } from "../../types/user";
import UserTag from "../atoms/user_tag";

type EditMembersModalProps = {
  membersRef: CollectionReference<User>;
  payments: Payment[];
  isOpen: boolean;
  onClose: () => void;
  members: User[];
};

export default function EditMembersModal(props: EditMembersModalProps) {
  const { membersRef, payments, isOpen, onClose, members } = props;

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Members</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Wrap justify="center">
            {members.map((member) => (
              <WrapItem key={member.id}>
                <UserTag
                  user={member}
                  deletable={isDeletable(member)}
                  onDelete={async () => {
                    console.log(member.id);
                    await onClickDeleteMember(member.id!);
                  }}
                />
              </WrapItem>
            ))}
          </Wrap>
        </ModalBody>
        <ModalFooter>
          <Button size="sm" onClick={onClose}>
            Done
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

  function isDeletable(member: User) {
    if (member.email) {
      return false;
    }

    for (const payment of payments) {
      if (payment.paidBy.id === member.id) {
        return false;
      }
    }

    return true;
  }

  async function onClickDeleteMember(memberId: string) {
    console.log(membersRef);
    const memberRef = doc(membersRef, memberId).withConverter(userConverter);
    console.log(memberRef);
    await deleteDoc(memberRef);
  }
}
