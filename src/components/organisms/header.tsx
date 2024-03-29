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
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/firebase";
import SignOutButton from "../molecules/sign_out_button";
import { useRouter } from "next/router";
import { useLocale } from "../../locale";
import { MdAdd, MdExpandMore } from "react-icons/md";

export default function Header() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const { pathname, asPath, query } = router;
  const { t, flag, locale } = useLocale();

  return (
    <Box as="section" pb={{ base: "12", md: "24" }}>
      <Box as="nav" px={{ base: "4", md: "8" }} py="4">
        <HStack>
          <NextLink href="/">
            <Heading size="md">TraPay</Heading>
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
              <MenuOptionGroup
                defaultValue={locale}
                title={t.language}
                type="radio"
              >
                <MenuItemOption
                  onClick={() => {
                    changeLocale("en");
                  }}
                  value="en"
                >
                  {t.english}
                </MenuItemOption>
                <MenuItemOption
                  onClick={() => {
                    changeLocale("ja");
                  }}
                  value="ja"
                >
                  {t.japanese}
                </MenuItemOption>
              </MenuOptionGroup>
            </MenuList>
          </Menu>
          {user && (
            <>
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
                  <NextLink href="/settings/profile">
                    <Text ml="3">{user?.displayName ?? ""}</Text>
                    <Text ml="3" fontSize="xs" color="grey">
                      {user?.email ?? ""}
                    </Text>
                  </NextLink>
                  <MenuDivider />
                  <NextLink href="/settings/receive-methods">
                    <MenuItem>{t.receiveMethods}</MenuItem>
                  </NextLink>
                  <MenuDivider />
                  <MenuItem>
                    <SignOutButton />
                  </MenuItem>
                </MenuList>
              </Menu>
            </>
          )}
        </HStack>
      </Box>
    </Box>
  );

  function changeLocale(locale: string) {
    router.push({ pathname, query }, asPath, { locale: locale });
  }
}
