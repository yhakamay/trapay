import { Button } from "@chakra-ui/react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import { auth } from "../../firebaseConfig";
import { GoogleIcon } from "../../components/atoms/google_icon";

export function SignInButton() {
  const [loading, setLoading] = useState(false);

  return (
    <Button
      onClick={signIn}
      isLoading={loading}
      variant="outline"
      leftIcon={<GoogleIcon boxSize="5" />}
      iconSpacing="3"
    >
      Continue with Google
    </Button>
  );

  function signIn() {
    const provider = new GoogleAuthProvider();

    setLoading(true);

    signInWithPopup(auth, provider)
      .then((result) => {
        GoogleAuthProvider.credentialFromResult(result);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });

    setLoading(false);
  }
}
