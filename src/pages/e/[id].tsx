import {
  Box,
  Card,
  CardBody,
  Center,
  Heading,
  HStack,
  Spacer,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { collection, doc } from "firebase/firestore";
import { User as FirebaseUser } from "firebase/auth";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import CopyToClipboardButton from "../../components/atoms/copy_to_clipboard_button";
import EventDate from "../../components/atoms/event_date";
import Loading from "../../components/atoms/loading";
import SummaryCard from "../../components/molecules/summary_card";
import NewPaymentForm from "../../components/organisms/new_payment_form";
import PaymentsList from "../../components/organisms/payments_list";
import { auth, db } from "../../../firebase.config";
import { eventConverter } from "../../types/event";
import { userConverter } from "../../types/user";
import JoinEventModal from "../../components/organisms/join_event_modal";
import { MdOutlineCalendarToday } from "react-icons/md";
import EventMoreButton from "../../components/molecules/event_more_button";
import EditMembersModal from "../../components/organisms/edit_members_modal";
import { paymentConverter } from "../../types/payment";
import { SomethingWentWrong } from "../../components/atoms/something_went_wrong";

type EventDetailsProps = {
  id: string;
};

export default function EventDetails(props: EventDetailsProps) {
  const { id } = props;
  const router = useRouter();
  const [user] = useAuthState(auth);
  const eventsRef = collection(db, "events");
  const eventRef = doc(eventsRef, id).withConverter(eventConverter);
  const [event, loadingEvent, error] = useDocumentData(eventRef);
  const membersRef = collection(eventRef, "members").withConverter(
    userConverter
  );
  const [members, loadingMembers] = useCollectionData(membersRef);
  const paymentsRef = collection(eventRef, "payments").withConverter(
    paymentConverter
  );
  const [payments, loadingPayments] = useCollectionData(paymentsRef);
  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true });
  const {
    isOpen: isOpenEditMembers,
    onOpen: onOpenEditMembers,
    onClose: onCloseEditMembers,
  } = useDisclosure();

  if (!router.isReady || loadingEvent || loadingMembers || loadingPayments) {
    return <Loading />;
  }

  if (!user) {
    router.push(`/login?e=${id}`);
  }

  if (error || !event) {
    return <SomethingWentWrong />;
  }

  closeModalIfMember(user, isOpen, onClose);

  return (
    <>
      <Head>
        <title>{event.title}</title>
      </Head>
      <JoinEventModal
        isOpen={isOpen}
        onClose={onClose}
        eventRef={eventRef}
        firebaseUser={user!}
        members={members!}
      />
      <EditMembersModal
        membersRef={membersRef}
        isOpen={isOpenEditMembers}
        onClose={onCloseEditMembers}
        members={members!}
        payments={payments!}
      />
      <Center>
        <Box w={{ base: "sm", md: "lg" }}>
          <VStack spacing="4">
            <Card w={{ base: "sm", md: "lg" }} variant="filled">
              <CardBody>
                <HStack w="full" justify="space-between">
                  <Heading size="lg">{event.title}</Heading>
                  <Spacer />
                  <MdOutlineCalendarToday color="grey" />
                  <EventDate date={new Date(event.date ?? "")} />
                </HStack>
                <Text alignSelf="start">{event.description}</Text>
                <HStack w="full" justify="end">
                  <CopyToClipboardButton eventId={event.id!} />
                  <EventMoreButton
                    eventRef={eventRef}
                    onOpenEditMembers={onOpenEditMembers}
                  />
                </HStack>
              </CardBody>
            </Card>
            <SummaryCard
              eventId={id}
              user={user!}
              payments={payments!}
              members={members!}
            />
            <NewPaymentForm eventRef={eventRef} />
            <PaymentsList paymentsRef={paymentsRef} payments={payments!} />
          </VStack>
        </Box>
      </Center>
    </>
  );

  function closeModalIfMember(
    user: FirebaseUser | null | undefined,
    isOpen: boolean,
    onClose: () => void
  ) {
    members?.some((member) => {
      const isMember = member.id === user?.uid;

      if (isMember && isOpen) {
        onClose();
      }
    });
  }
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.params?.id as string;
  return { props: { id } };
};
