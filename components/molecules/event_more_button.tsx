import {
  Menu,
  MenuButton,
  IconButton,
  MenuList,
  MenuItem,
  useToast,
} from "@chakra-ui/react";
import { deleteDoc, DocumentReference } from "firebase/firestore";
import router from "next/router";
import { MdMoreHoriz, MdDelete, MdPeople } from "react-icons/md";
import { Event } from "../../types/event";

type EventMoreButtonProps = {
  eventRef: DocumentReference<Event>;
  onOpenEditMembers: () => void;
};

export default function EventMoreButton(props: EventMoreButtonProps) {
  const { eventRef, onOpenEditMembers } = props;
  const toast = useToast();
  const toastId = eventRef.id;

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="options"
        size="sm"
        variant="outline"
        icon={<MdMoreHoriz />}
      />
      <MenuList>
        <MenuItem onClick={onClickEditMembers} icon={<MdPeople />}>
          Edit members
        </MenuItem>
        <MenuItem onClick={onClickDeleteEvent} icon={<MdDelete />} color="red">
          Delete
        </MenuItem>
      </MenuList>
    </Menu>
  );

  function onClickEditMembers() {
    onOpenEditMembers();
  }

  async function onClickDeleteEvent() {
    await deleteEvent(eventRef);
    toast({
      id: toastId,
      title: "Deleted",
      description: "Event deleted",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top",
    });
    router.push("/");
  }

  async function deleteEvent(eventRef: DocumentReference<Event>) {
    await deleteDoc(eventRef);
  }
}
