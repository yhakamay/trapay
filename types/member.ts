import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from "firebase/firestore";

export type Member = {
  id?: string | null;
  name: string;
  email: string | null;
  imageUrl: string | null;
};

export const memberConverter: FirestoreDataConverter<Member> = {
  toFirestore: (member: WithFieldValue<Member>): DocumentData => ({
    name: member.name,
    email: member.email,
    imageUrl: member.imageUrl,
  }),
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Member => {
    const data = snapshot.data(options);

    return {
      id: snapshot.id,
      name: data.name,
      email: data.email,
      imageUrl: data.imageUrl,
    };
  },
};
