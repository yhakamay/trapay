import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@chakra-ui/react";

type JoinEventModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function JoinEventModal(props: JoinEventModalProps) {
  const { isOpen, onClose } = props;

  return (
    <Modal
      isOpen={isOpen}
      isCentered={true}
      onClose={onClose}
      closeOnOverlayClick={false}
      closeOnEsc={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Join this event?</ModalHeader>
        <ModalBody>{"You're invited! Join the event first."}</ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
