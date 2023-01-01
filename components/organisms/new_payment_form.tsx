import { ChevronDownIcon, AddIcon } from "@chakra-ui/icons";
import {
  HStack,
  VStack,
  Input,
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
  Avatar,
  IconButton,
  Box,
} from "@chakra-ui/react";
import { User } from "../../types/user";

type NewPaymentFormProps = {
  members: User[];
  setNewPaymentTitle: (title: string) => void;
  setNewPaymentAmount: (amount: number) => void;
  setNewPaymentBy: (user: User) => void;
  newPaymentTitle: string;
  newPaymentAmount: number | undefined;
  newPaymentBy?: User;
  addPayment: () => void;
};

export default function NewPaymentForm(props: NewPaymentFormProps) {
  const {
    members,
    setNewPaymentTitle,
    setNewPaymentAmount,
    setNewPaymentBy,
    newPaymentTitle,
    newPaymentAmount,
    newPaymentBy,
    addPayment,
  } = props;

  return (
    <Box w={{ base: "sm", md: "lg" }}>
      <HStack spacing="4">
        <VStack w="full">
          <Input
            onChange={(e) => setNewPaymentTitle(e.target.value)}
            value={newPaymentTitle}
            placeholder="Title"
          />
          <HStack spacing="4" w="full">
            <Input
              onChange={(e) => setNewPaymentAmount(Number(e.target.value))}
              value={newPaymentAmount || undefined}
              placeholder="Amount"
              type="number"
            />
            <Menu>
              <MenuButton w="full" as={Button} rightIcon={<ChevronDownIcon />}>
                Paid by
              </MenuButton>
              <MenuList>
                {members?.map((member) => (
                  <MenuItem
                    key={member.id}
                    onClick={() => setNewPaymentBy(member)}
                  >
                    <Avatar
                      size="sm"
                      src={member.photoURL ?? undefined}
                      name={member.name}
                      mr="2"
                    />
                    {member.name}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </HStack>
        </VStack>
        <IconButton
          disabled={!newPaymentTitle || !newPaymentAmount || !newPaymentBy}
          icon={<AddIcon />}
          onClick={addPayment}
          aria-label={"add"}
        />
      </HStack>
    </Box>
  );
}
