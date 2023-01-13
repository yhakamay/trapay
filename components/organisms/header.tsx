import NextLink from "next/link";
import {
  Avatar,
  Box,
  Button,
  Heading,
  HStack,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebaseConfig";
import SignOutButton from "../molecules/sign_out_button";
import { useRouter } from "next/router";
import { useLocale } from "../../locale";
import { MdAdd, MdExpandMore } from "react-icons/md";

export default function Header() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const { t, flag } = useLocale();

  if (!user) return <></>;

  return (
    <Box as="section" pb={{ base: "12", md: "24" }}>
      <Box as="nav" px={{ base: "4", md: "8" }} py="4">
        <HStack>
          <NextLink href="/">
            <Heading size="lg">TraPay</Heading>
          </NextLink>
          <Spacer />
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<MdExpandMore />}
              size="sm"
              variant="ghost"
            >
              {flag}
            </MenuButton>
            <MenuList>
              <NextLink href={"/"} locale="en">
                <MenuItem>🇺🇸</MenuItem>
              </NextLink>
              <NextLink href={"/"} locale="ja">
                <MenuItem>🇯🇵</MenuItem>
              </NextLink>
            </MenuList>
          </Menu>
          <Button
            size="sm"
            onClick={() => router.push("/new")}
            leftIcon={<MdAdd />}
          >
            {t.newEvent}
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
              <Text ml="3">{user?.displayName ?? ""}</Text>
              <Text ml="3" fontSize="xs" color="grey">
                {user?.email ?? ""}
              </Text>
              <MenuDivider />
              <MenuItem>
                <NextLink href="/settings/payment-methods">
                  {t.paymentMethods}
                </NextLink>
              </MenuItem>
              <MenuDivider />
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
