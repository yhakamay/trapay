import {
  Menu,
  MenuButton,
  IconButton,
  MenuList,
  MenuItem,
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
          }}
          icon={<MdDelete />}
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
