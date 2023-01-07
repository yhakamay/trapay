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
import { MdMoreHoriz, MdDelete } from "react-icons/md";
import { Event } from "../../types/event";

type EventMoreButtonProps = {
  eventRef: DocumentReference<Event>;
};

export default function EventMoreButton(props: EventMoreButtonProps) {
  const { eventRef } = props;
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
        <MenuItem
          onClick={async () => {
            await deleteEvent(eventRef);
            router.push("/");
            if (!toast.isActive(toastId)) {
              toast({
                id: toastId,
                title: "Deleting event. This may take a while.",
              });
            }
          }}
          icon={<MdDelete />}
          color="red"
        >
          Delete
        </MenuItem>
      </MenuList>
    </Menu>
  );

  async function deleteEvent(eventRef: DocumentReference<Event>) {
    await deleteDoc(eventRef);
  }
}
