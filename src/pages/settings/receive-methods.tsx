import {
  Box,
  Card,
  CardBody,
  Center,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import { collection, doc } from "firebase/firestore";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import Loading from "../../components/atoms/loading";
import { auth, db } from "../../../firebase.config";
import { paymentMethodConverter } from "../../types/payment_method";
import { userConverter } from "../../types/user";
import NewReceiveMethodForm from "../../components/organisms/new_receive_method_form";
import { PaymentMethodsList } from "../../components/organisms/payment_methods_list";
import NoItems from "../../components/atoms/no_items";
import { useLocale } from "../../../locale";

export default function PaymentMethods() {
  const router = useRouter();
  const [user, loadingUser] = useAuthState(auth);
  const usersRef = collection(db, "users");
  const userRef = user
    ? doc(usersRef, user?.uid).withConverter(userConverter)
    : null;
  const methodsRef = user
    ? collection(userRef!, "payment-methods").withConverter(
        paymentMethodConverter
      )
    : null;
  const [methods, loadingMethods] = useCollectionData(methodsRef);
  const noMethods = methods?.length === 0;
  const { t } = useLocale();

  if (!router.isReady || loadingUser || loadingMethods) {
    return <Loading />;
  }

  if (!user) {
    router.push("/login");
  }

  return (
    <>
      <Head>
        <title>{t.receiveMethods}</title>
      </Head>
      <Center>
        <Box w={{ base: "sm", md: "lg" }}>
          <Stack>
            <Card variant="filled">
              <CardBody>
                <Heading size="lg">{t.receiveMethods}</Heading>
                <Box h="2" />
                <Text>{t.receiveMethodsDescription}</Text>
              </CardBody>
            </Card>
            <Box h="4" />
            <NewReceiveMethodForm methodsRef={methodsRef!} />
            <Box h="4" />
            {noMethods ? (
              <NoItems text={"No methods yet. Add one!"} />
            ) : (
              PaymentMethodsList({
                methodsRef: methodsRef!,
                methods: methods!,
              })
            )}
          </Stack>
        </Box>
      </Center>
    </>
  );
}
