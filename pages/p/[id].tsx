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
import NoItems from "../../components/atoms/NoItems";
import { auth, db } from "../../firebaseConfig";
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

  if (!router.isReady || loadingMember || loadingMethods) {
    return <Loading />;
  }

  if (!user) {
    router.push(`/login?e=${id}`);
  }

  if (errorMethods || errorMember) {
    return (
      <Center>
        <Text>Something went wrong.</Text>
      </Center>
    );
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
              Your friend yet to join the event. Please ask them to join.
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
                <Heading>Payment methods</Heading>
                <Text>
                  Pay them using one of the following payment methods.
                </Text>
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
