import NextLink from "next/link";
import { AddIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Heading,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
} from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebaseConfig";
import SignOutButton from "../molecules/sign_out_button";
import { useRouter } from "next/router";

export default function Header() {
  const [user] = useAuthState(auth);
  const router = useRouter();

  if (!user) return <></>;

  return (
    <Box as="section" pb={{ base: "12", md: "24" }}>
      <Box as="nav" px={{ base: "4", md: "8" }} py="4">
        <HStack>
          <NextLink href="/">
            <Heading size="lg">TraPay</Heading>
          </NextLink>
          <Spacer />
          <Button onClick={() => router.push("/new")} leftIcon={<AddIcon />}>
            New
          </Button>
          <Menu>
            <MenuButton>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user?.displayName ?? ""}
                src={user?.photoURL ?? undefined}
              />
            </MenuButton>
            <MenuList>
              <MenuItem>
                <SignOutButton />
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Box>
    </Box>
  );
}
