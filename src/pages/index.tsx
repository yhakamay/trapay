import { Wrap, WrapItem } from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import EventCard from "../components/molecules/event_card";
import { auth, db } from "../firebase/firebase";
import { collection, doc } from "firebase/firestore";
import { eventConverter } from "../types/event";
import { useRouter } from "next/router";
import { userConverter } from "../types/user";
import Loading from "../components/atoms/loading";
import NoItems from "../components/atoms/no_items";
import { useLocale } from "../../locale";
import { SomethingWentWrong } from "../components/atoms/something_went_wrong";

export default function Home() {
  const router = useRouter();
  const [user, loadingUser, errorUser] = useAuthState(auth);
  const usersRef = collection(db, "users").withConverter(userConverter);
  const userRef = user ? doc(usersRef, user.uid) : null;
  const eventsRef = userRef
    ? collection(userRef, "events").withConverter(eventConverter)
    : null;
  const [events, loadingEvents, errorEvents] = useCollectionData(eventsRef);
  const noEvents = events?.length === 0;
  const { t } = useLocale();

  if (!router.isReady || loadingUser || loadingEvents) {
    return <Loading />;
  }

  if (!user) {
    router.push("/login");
  }

  if (errorUser || errorEvents) {
    return <SomethingWentWrong />;
  }

  if (noEvents) {
    return <NoItems text={t.noEvents} />;
  }

  return (
    <Wrap justify="center">
      {events?.map((event) => (
        <WrapItem key={event.id}>
          <EventCard
            id={event.id?.toString() ?? ""}
            title={event.title}
            date={event.date ?? ""}
            description={event.description ?? ""}
            h="xs"
          />
        </WrapItem>
      ))}
    </Wrap>
  );
}
