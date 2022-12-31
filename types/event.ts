import { Payment } from "./payment";

export type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  createdAt: string;
  imageUrl: string;
  payments: Array<Payment>;
};

//export const eventConverter = {
//  toFirestore: (event: Event) => ({
//    title: event.title,
//    description: event.description,
//    date: event.date,
//    imageUrl: event.imageUrl,
//  }),
//  fromFirestore: (
//    snapshot: firebase.firestore.QueryDocumentSnapshot,
//    options: firebase.firestore.SnapshotOptions
//  ) => {
//    const data = snapshot.data(options);

//    return {
//      id: snapshot.id,
//      title: data.title,
//      description: data.description,
//      date: data.date,
//      imageUrl: data.imageUrl,
//    };
//  },
//};
