import {
  InputGroup,
  Input,
  Textarea,
  InputRightElement,
  IconButton,
  Wrap,
  Button,
  Box,
} from "@chakra-ui/react";
import {
  collection,
  addDoc,
  CollectionReference,
  setDoc,
  doc,
} from "firebase/firestore";
import { User as FirebaseUser } from "firebase/auth";
import { useRouter } from "next/router";
import { useState } from "react";
import { db } from "../../firebaseConfig";
import { Event, eventConverter } from "../../types/event";
import { User, userConverter } from "../../types/user";
import Loading from "../atoms/loading";
import UserTag from "../atoms/user_tag";
import { MdPersonAddAlt1, MdSaveAlt } from "react-icons/md";

type NewEventFormProps = {
  firebaseUser: FirebaseUser;
};

export default function NewEventForm(props: NewEventFormProps) {
  const { firebaseUser } = props;
  const router = useRouter();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [newMemberName, setNewMemberName] = useState<string>("");
  const user = convertToUser(firebaseUser);
  const [members, setMembers] = useState<User[]>([user]);
  const [loading, setLoading] = useState<boolean>(false);

  if (!router.isReady) {
    return <Loading />;
  }

  return (
    <>
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
        <InputRightElement mr="-1">
          <IconButton
            onClick={onClickAddMember}
            disabled={newMemberName === ""}
            icon={<MdPersonAddAlt1 />}
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
            deletable={member.id !== user.id}
            onDelete={() => setMembers(members.filter((m) => m !== member))}
          />
        ))}
      </Wrap>
      <Box h="8" />
      <Button
        isLoading={loading}
        onClick={onClickSaveEvent}
        leftIcon={<MdSaveAlt />}
      >
        Save
      </Button>
    </>
  );

  function convertToUser(firebaseUser: FirebaseUser) {
    return {
      id: firebaseUser.uid!,
      name: firebaseUser.displayName ?? "",
      email: firebaseUser.email ?? "",
      photoURL: firebaseUser.photoURL ?? "",
    };
  }

  function onClickAddMember() {
    const newMember: User = {
      id: null,
      name: newMemberName,
      email: null,
      photoURL: null,
    };
    setMembers([...members, newMember]);
    setNewMemberName("");
  }

  function onClickSaveEvent() {
    setLoading(true);
    saveEvent();
    setLoading(false);
  }

  async function saveEvent(): Promise<void> {
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
