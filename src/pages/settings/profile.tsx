import {
  Alert,
  AlertIcon,
  Avatar,
  Box,
  Card,
  CardBody,
  Center,
  Heading,
  HStack,
  IconButton,
  Input,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { updateProfile } from "firebase/auth";
import { collection, doc, updateDoc } from "firebase/firestore";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { MdCheck } from "react-icons/md";
import { auth, db } from "../../../firebase.config";
import { useLocale } from "../../../locale";
import Loading from "../../components/atoms/loading";

export default function Profile() {
  const { t } = useLocale();
  const router = useRouter();
  const [user, loadingUser] = useAuthState(auth);
  const [newDisplayName, setNewDisplayName] = useState(user?.displayName);
  const toast = useToast();

  if (!router.isReady || loadingUser) {
    return <Loading />;
  }

  if (!user) {
    router.push("/login");
  }

  if (newDisplayName === undefined) {
    setNewDisplayName(user?.displayName ?? "");
  }

  return (
    <>
      <Head>
        <title>{t.receiveMethods}</title>
      </Head>
      <Center>
        <Box w={{ base: "sm", md: "lg" }}>
          <VStack spacing="4">
            <Card variant="filled">
              <CardBody>
                <Heading size="lg">{t.receiveMethods}</Heading>
                <Box h="2" />
                <Text>{t.receiveMethodsDescription}</Text>
              </CardBody>
            </Card>
            <Alert status="info">
              <AlertIcon />
              <Text>
                Currently, you cannot update your profile picture. Hang tight
                for upcoming version.
              </Text>
            </Alert>
            <Avatar
              src={user?.photoURL ?? ""}
              name={user?.displayName ?? ""}
              size="lg"
            />
            <HStack>
              <Box w="16" />
              <Input
                onChange={(e) => setNewDisplayName(e.target.value)}
                textAlign="center"
                value={newDisplayName ?? ""}
              />
              <IconButton
                isDisabled={
                  newDisplayName === user?.displayName || !newDisplayName
                }
                onClick={() => onChangeDisplayName(newDisplayName!)}
                aria-label="Update display name"
                variant="outline"
                icon={<MdCheck />}
              />
            </HStack>
          </VStack>
        </Box>
      </Center>
    </>
  );

  async function onChangeDisplayName(newDisplayName: string) {
    if (!user || !newDisplayName || newDisplayName === user.displayName) {
      return;
    }

    await updateProfile(user, { displayName: newDisplayName });

    const usersRef = collection(db, "users");
    const userRef = doc(usersRef, user.uid);
    await updateDoc(userRef, {
      name: newDisplayName,
    });

    toast({
      title: `Updated your name to ${newDisplayName}`,
      status: "success",
    });

    setNewDisplayName(user.displayName);
  }
}
