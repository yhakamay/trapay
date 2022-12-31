import { Button } from "@chakra-ui/react";
import { useState } from "react";
import { auth } from "../../firebaseConfig";

export default function SignOutButton() {
  const [loading, setLoading] = useState(false);

  return (
    <Button
      onClick={signOut}
      isLoading={loading}
      color="tomato"
      variant="ghost"
    >
      Sign Out
    </Button>
  );

  function signOut() {
    setLoading(true);
    setTimeout(() => {
      auth.signOut();
      setLoading(false);
    }, 1500);
  }
}
