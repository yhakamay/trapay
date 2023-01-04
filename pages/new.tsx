import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Textarea,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import {
  addDoc,
  collection,
  CollectionReference,
  doc,
  setDoc,
} from "firebase/firestore";
import Head from "next/head";
import NextImage from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import Loading from "../components/atoms/loading";
import UserTag from "../components/atoms/user_tag";
import { auth, db } from "../firebaseConfig";
import { Event, eventConverter } from "../types/event";
import { User, userConverter } from "../types/user";

export default function NewEvent() {
  const [user, loadingUser, errorUser] = useAuthState(auth);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [newMemberName, setNewMemberName] = useState<string>("");
  const me: User = {
    id: auth.currentUser?.uid ?? "",
    name: auth.currentUser?.displayName ?? "",
    email: auth.currentUser?.email ?? "",
    photoURL: auth.currentUser?.photoURL ?? "",
  };
  const [members, setMembers] = useState<User[]>([me]);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  if (!router.isReady || loadingUser) {
    return <Loading />;
  }

  if (!user) {
    router.push("/login");
  }

  return (
    <>
      <Head>
        <title>New Event</title>
      </Head>
      <Center>
        <Box w={{ base: "sm", md: "lg" }}>
          <VStack spacing="4">
            <Heading>Add new event</Heading>
            <NextImage
              src="/new.svg"
              alt={"new event"}
              width="200"
              height="200"
            />
            <InputGroup>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
              />
            </InputGroup>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optional)"
              resize="none"
            />
            <InputGroup>
              <Input
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="Select Date and Time"
                size="md"
                type="date"
              />
            </InputGroup>
            <InputGroup>
              <Input
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                placeholder="Members"
              />
              <InputRightElement mr="2">
                <IconButton
                  onClick={() => {
                    const newMember: User = {
                      id: null,
                      name: newMemberName,
                      email: null,
                      photoURL: null,
                    };
                    setMembers([...members, newMember]);
                    setNewMemberName("");
                  }}
                  disabled={newMemberName === ""}
                  icon={<AddIcon />}
                  aria-label={"add"}
                  variant="unstyled"
                />
              </InputRightElement>
            </InputGroup>
            <Wrap>
              {members.map((member, i) => (
                <UserTag
                  key={i}
                  user={member}
                  deletable={member.id !== me.id}
                  onDelete={() =>
                    setMembers(members.filter((m) => m !== member))
                  }
                />
              ))}
            </Wrap>
            <Box h="8" />
            <Button isLoading={loading} onClick={saveEvent}>
              Save
            </Button>
          </VStack>
        </Box>
      </Center>
    </>
  );

  async function saveEvent(): Promise<void> {
    setLoading(true);

    const event: Event = {
      title,
      description,
      date,
      imageUrl: null,
    };

    // Save this event to the Firestore events/id then redirect to the event page
    const eventsRef = collection(db, "events").withConverter(eventConverter);
    const eventRef = await addDoc(eventsRef, event);

    // Add members to the members collection
    const membersRef = collection(eventRef, "members").withConverter(
      userConverter
    );

    await Promise.all(
      members.map((memberName) => addMember(membersRef, memberName))
    );

    setLoading(false);

    // Redirect to the event page
    router.push(`/e/${eventRef.id}`);
  }

  async function addMember(
    membersRef: CollectionReference<User>,
    member: User
  ): Promise<void> {
    if (member.id) {
      setDoc<User>(doc(membersRef, member.id), member);
    } else {
      await addDoc<User>(membersRef, member);
    }
  }
}
