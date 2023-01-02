import { Button } from "@chakra-ui/react";
import { useState } from "react";
import { auth } from "../../firebaseConfig";

export default function SignOutButton() {
  const [loading, setLoading] = useState(false);

  return (
    <Button
      onClick={signOut}
      isLoading={loading}
      w="full"
      variant="unstyled"
      color="tomato"
    >
      Sign Out
    </Button>
  );

  function signOut() {
    setLoading(true);
    auth.signOut();
    setLoading(false);
  }
}
