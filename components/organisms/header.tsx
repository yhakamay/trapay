import NextLink from "next/link";
import { AddIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Center,
  Heading,
  HStack,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spacer,
} from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebaseConfig";
import SignOutButton from "../molecules/sign_out_button";

export default function Header() {
  const [user] = useAuthState(auth);

  if (!user) return <></>;

  return (
    <Box as="section" pb={{ base: "12", md: "24" }}>
      <Box as="nav" px={{ base: "4", md: "8" }} py="4">
        <HStack>
          <NextLink href="/">
            <Heading>TraPay</Heading>
          </NextLink>
          <Spacer />
          <Button as="a" href="/new" leftIcon={<AddIcon />}>
            New
          </Button>
          <Menu>
            <MenuButton>
              <Avatar
                size={{ base: "sm", md: "md" }}
                cursor="pointer"
                name={user?.displayName ?? ""}
                src={user?.photoURL ?? undefined}
              />
            </MenuButton>
            <MenuList>
              <MenuItem>
                <Link
                  color="grey"
                  cursor="not-allowed"
                  w="full"
                  textAlign="center"
                >
                  Profile
                </Link>
              </MenuItem>
              <MenuDivider />
              <Center>
                <SignOutButton />
              </Center>
            </MenuList>
          </Menu>
        </HStack>
      </Box>
    </Box>
  );
}
