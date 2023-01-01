import { AddIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Center,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Tag,
  TagCloseButton,
  TagLabel,
  Textarea,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import {
  addDoc,
  collection,
  CollectionReference,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { useState } from "react";
import { auth, db } from "../firebaseConfig";
import { Event, eventConverter } from "../types/event";
import { User, userConverter } from "../types/user";

export default function NewEvent() {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [newMemberName, setNewMemberName] = useState<string>("");
  const [memberNames, setMemberNames] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  return (
    <Center>
      <Box w={{ base: "sm", md: "lg" }}>
        <VStack spacing="4">
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
                  setMemberNames([...memberNames, newMemberName]);
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
            {memberNames.map((memberName, i) => (
              <>
                <Tag key={i} borderRadius="full">
                  <Avatar
                    src={undefined}
                    size="xs"
                    name={memberName}
                    ml={-1}
                    mr={2}
                  />
                  <TagLabel>{memberName}</TagLabel>
                  <TagCloseButton
                    onClick={() =>
                      setMemberNames(
                        memberNames.filter((m) => m !== memberName)
                      )
                    }
                  />
                </Tag>
              </>
            ))}
          </Wrap>
          <Box h="8" />
          <Button isLoading={loading} onClick={saveEvent}>
            Save
          </Button>
        </VStack>
      </Box>
    </Center>
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
      memberNames.map((memberName) => addMember(membersRef, memberName))
    );

    // Add this event to the user's events
    await copyEventToUser(eventRef.id, event);

    setLoading(false);

    // Redirect to the event page
    router.push(`/e/${eventRef.id}`);
  }

  async function addMember(
    membersRef: CollectionReference<User>,
    memberName: string
  ): Promise<void> {
    await addDoc<User>(membersRef, {
      id: null,
      name: memberName,
      photoURL: null,
      email: null,
    });
  }

  async function copyEventToUser(eventId: string, event: Event): Promise<void> {
    // Add this event to the user's events collection
    const uid = auth.currentUser?.uid;
    const usersRef = collection(db, "users").withConverter(userConverter);
    const userRef = doc(usersRef, uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const eventsRef = collection(userRef, "events").withConverter(
        eventConverter
      );
      await setDoc(doc(eventsRef, eventId), event);
    }
  }
}
