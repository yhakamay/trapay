import { Button } from "@chakra-ui/react";
import {
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useState } from "react";
import { auth } from "../../firebaseConfig";
import Image from "next/image";

export function SignInButtons() {
  const [loading, setLoading] = useState(false);

  return (
    <>
      <Button
        w="2xs"
        onClick={signIn}
        isLoading={loading}
        variant="outline"
        leftIcon={
          <Image width="16" height="16" src="/google.svg" alt={"Google logo"} />
        }
        iconSpacing="3"
      >
        Continue with Google
      </Button>
      <Button
        w="2xs"
        onClick={signInWithApple}
        isLoading={loading}
        variant="outline"
        leftIcon={
          <Image width="14" height="14" src="/apple.svg" alt={"Apple logo"} />
        }
        iconSpacing="3"
      >
        Sign in with Apple
      </Button>
    </>
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

  function signInWithApple() {
    const provider = new OAuthProvider("apple.com");

    setLoading(true);

    signInWithPopup(auth, provider)
      .then((result) => {
        OAuthProvider.credentialFromResult(result);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });

    setLoading(false);
  }
}
