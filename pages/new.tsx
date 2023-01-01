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
  VStack,
  Wrap,
} from "@chakra-ui/react";
import { addDoc, collection, CollectionReference } from "firebase/firestore";
import { useState } from "react";
import { db } from "../firebaseConfig";
import { eventConverter } from "../types/event";
import { User, userConverter } from "../types/user";

export default function NewEvent() {
  const [title, setTitle] = useState<string>("");
  const [newMemberName, setNewMemberName] = useState<string>("");
  const [memberNames, setMemberNames] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

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
          <InputGroup>
            <Input placeholder="Select Date and Time" size="md" type="date" />
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

    // Save this event to the Firestore events/id then redirect to the event page
    const eventsRef = collection(db, "events").withConverter(eventConverter);
    const docRef = await addDoc(eventsRef, {
      title,
      description: null,
      date: "",
      imageUrl: null,
    });

    // Add members to the members collection
    const membersRef = collection(docRef, "members").withConverter(
      userConverter
    );

    await Promise.all(
      memberNames.map((memberName) => addMember(membersRef, memberName))
    ).then(() => {
      setLoading(false);
    });
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
}
