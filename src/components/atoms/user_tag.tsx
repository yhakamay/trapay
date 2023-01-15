import {
  Tag,
  Avatar,
  TagLabel,
  TagCloseButton,
  TagRightIcon,
  As,
} from "@chakra-ui/react";
import { User } from "../../types/user";

type UserTagProps = {
  user: User;
  deletable: boolean;
  onDelete?: () => void;
  onClick?: () => void;
  selected?: boolean;
  variant?: "solid" | "subtle" | "outline";
  tagRightIcon?: As<any>;
  disabled?: boolean;
};

export default function UserTag(props: UserTagProps) {
  const {
    user,
    deletable,
    onDelete,
    onClick,
    selected,
    tagRightIcon,
    disabled,
  } = props;

  return (
    <Tag
      variant={
        selected
          ? "solid"
          : disabled
          ? "subtle"
          : onClick !== undefined
          ? "outline"
          : "subtle"
      }
      cursor={disabled ? "not-allowed" : "pointer"}
      onClick={onClick}
      colorScheme={disabled ? "gray" : undefined}
      color={disabled ? "gray" : undefined}
      size="md"
      borderRadius="full"
    >
      <Avatar
        color={disabled ? "gray.500" : undefined}
        src={user.photoURL ?? undefined}
        size="2xs"
        name={user.name}
        ml={-1}
        mr={2}
      />
      <TagLabel>{user.name}</TagLabel>
      {deletable && <TagCloseButton onClick={onDelete} />}
      {tagRightIcon && <TagRightIcon as={tagRightIcon} />}
    </Tag>
  );
}
