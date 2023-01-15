import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from "firebase/firestore";
import { User } from "./user";

export type Payment = {
  id?: string | null;
  title: string;
  amount: number;
  createdAt?: string | null;
  paidBy: User;
};

export const paymentConverter: FirestoreDataConverter<Payment> = {
  toFirestore: (payment: Payment): DocumentData => ({
    title: payment.title,
    amount: payment.amount,
    paidBy: payment.paidBy,
  }),
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Payment => {
    const data = snapshot.data(options);

    return {
      id: snapshot.id,
      title: data.title,
      amount: data.amount,
      createdAt: data.createdAt,
      paidBy: data.paidBy,
    };
  },
};
