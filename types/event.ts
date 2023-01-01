import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from "firebase/firestore";

export type Event = {
  id?: string | null;
  title: string;
  description: string | null;
  date: string;
  createdAt?: string | null;
  imageUrl: string | null;
};

export const eventConverter: FirestoreDataConverter<Event> = {
  toFirestore: (event: WithFieldValue<Event>): DocumentData => ({
    title: event.title,
    description: event.description,
    date: event.date,
    imageUrl: event.imageUrl,
  }),
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Event => {
    const data = snapshot.data(options);

    return {
      id: snapshot.id,
      title: data.title,
      description: data.description,
      date: data.date,
      createdAt: data.createdAt,
      imageUrl: data.imageUrl,
    };
  },
};
