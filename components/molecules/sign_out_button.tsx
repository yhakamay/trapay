import { Box, HStack, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useState } from "react";
import { auth } from "../../firebaseConfig";
import { MdLogout } from "react-icons/md";

export default function SignOutButton() {
  const [loading, setLoading] = useState(false);

  return (
    <Box w="full">
      <Link href="/login" onClick={signOut}>
        {loading ? (
          <Text>Signing out...</Text>
        ) : (
          <HStack>
            <Text>Sign out</Text>
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
