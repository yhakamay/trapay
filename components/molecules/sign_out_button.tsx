import { Box, HStack, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useState } from "react";
import { auth } from "../../firebaseConfig";
import { MdLogout } from "react-icons/md";
import { useLocale } from "../../locale";

export default function SignOutButton() {
  const [loading, setLoading] = useState(false);
  const { t } = useLocale();

  return (
    <Box w="full">
      <Link href="/login" onClick={signOut}>
        {loading ? (
          <Text>{t.signingOut}</Text>
        ) : (
          <HStack>
            <Text>{t.signOut}</Text>
            <MdLogout />
          </HStack>
        )}
      </Link>
    </Box>
  );

  function signOut() {
    setLoading(true);
    auth.signOut();
    setLoading(false);
  }
}
