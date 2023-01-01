import { Tag, Avatar, TagLabel, TagCloseButton } from "@chakra-ui/react";
import { User } from "../../types/user";

type UserTagProps = {
  user: User;
  deletable: boolean;
  onDelete: () => void;
};

export default function UserTag(props: UserTagProps) {
  const { user, deletable, onDelete } = props;

  return (
    <Tag size="md" borderRadius="full">
      <Avatar
        src={user.photoURL ?? undefined}
        size="2xs"
        name={user.name}
        ml={-1}
        mr={2}
      />
      <TagLabel>{user.name}</TagLabel>
      {deletable && <TagCloseButton onClick={onDelete} />}
    </Tag>
  );
}
