import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Card,
  CardBody,
  Center,
  Heading,
  Stack,
  StackDivider,
  Text,
  VStack,
  Link,
} from "@chakra-ui/react";
import { collection, doc } from "firebase/firestore";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import { MdArrowBack } from "react-icons/md";

import Loading from "../../components/atoms/loading";
import NoItems from "../../components/atoms/no_items";
import { SomethingWentWrong } from "../../components/atoms/something_went_wrong";
import { auth, db } from "../../firebaseConfig";
import { useLocale } from "../../locale";
import { paymentMethodConverter } from "../../types/payment_method";
import { userConverter } from "../../types/user";

type PayProps = {
  id: string;
  to: string;
};

export default function Pay(props: PayProps) {
  const { id, to } = props;
  const router = useRouter();
  const [user] = useAuthState(auth);
  const toRef = doc(db, "users", to).withConverter(userConverter);
  const [toMember, loadingMember, errorMember] = useDocumentData(toRef);
  const paymentMethodsRef = collection(toRef, "payment-methods").withConverter(
    paymentMethodConverter
  );
  const [paymentMethods, loadingMethods, errorMethods] =
    useCollectionData(paymentMethodsRef);
  const { t } = useLocale();

  if (!router.isReady || loadingMember || loadingMethods) {
    return <Loading />;
  }

  if (!user) {
    router.push(`/login?e=${id}`);
  }

  if (errorMethods || errorMember) {
    return <SomethingWentWrong />;
  }

  const isNotAssigned = !toMember;

  if (isNotAssigned) {
    return (
      <>
        <Head>
          <title>{`Pay to friend`}</title>
        </Head>
        <Center>
          <VStack spacing="4">
            <Alert w={{ base: "sm", md: "lg" }} status="error">
              <AlertIcon />
              {t.friendNotJoined}
            </Alert>
          </VStack>
        </Center>
      </>
    );
  }

  const noMethods = paymentMethods?.length === 0;

  return (
    <>
      <Head>
        <title>{`Pay to ${toMember?.name ?? "friend"}`}</title>
      </Head>
      <Center>
        <VStack spacing="4">
          <VStack spacing="4">
            <Card w={{ base: "sm", md: "lg" }} variant="filled">
              <CardBody>
                <Heading size="lg">{t.paymentMethods}</Heading>
                <Box h="2" />
                <Text>{t.payToYourFriend}</Text>
              </CardBody>
            </Card>
            {noMethods ? (
              <NoItems text={"No methods. Ask them to add one!"} />
            ) : (
              <Card w={{ base: "sm", md: "lg" }} variant="outline">
                <CardBody>
                  <Stack divider={<StackDivider />} spacing="4">
                    {paymentMethods?.map((paymentMethod) => (
                      <Box key={paymentMethod.id}>
                        <Heading size="xs">{paymentMethod.name}</Heading>
                        <Text pt="2" fontSize="sm">
                          {paymentMethod.description}
                        </Text>
                        <Link
                          href={paymentMethod.url ?? ""}
                          isExternal
                          fontSize="sm"
                        >
                          {paymentMethod.url}
                        </Link>
                      </Box>
                    ))}
                  </Stack>
                </CardBody>
              </Card>
            )}
          </VStack>
          <Button onClick={() => router.push(`/e/${id}`)} variant="outline">
            <MdArrowBack />
          </Button>
        </VStack>
      </Center>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.params!.id as string;
  const to = context.query!.to as string;
  return { props: { id, to } };
};
