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
  photoURL: string | null;
};

export const userConverter: FirestoreDataConverter<User> = {
  toFirestore: (user: WithFieldValue<User>): DocumentData => ({
    name: user.name,
    email: user.email,
    photoURL: user.photoURL,
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
      photoURL: data.photoURL,
    };
  },
};
