import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from "firebase/firestore";

export type User = {
  id?: string | null;
  name: string;
  email: string | null;
  imageUrl: string | null;
};

export const userConverter: FirestoreDataConverter<User> = {
  toFirestore: (user: WithFieldValue<User>): DocumentData => ({
    name: user.name,
    email: user.email,
    imageUrl: user.imageUrl,
  }),
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): User => {
    const data = snapshot.data(options);

    return {
      id: snapshot.id,
      name: data.name,
      email: data.email,
      imageUrl: data.imageUrl,
    };
  },
};
