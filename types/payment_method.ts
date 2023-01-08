import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from "firebase/firestore";

export type PaymentMethod = {
  id?: string | null;
  default: boolean;
  name: string;
  url?: string | null;
  description?: string | null;
};

export const paymentMethodConverter: FirestoreDataConverter<PaymentMethod> = {
  toFirestore: (
    paymentMethod: WithFieldValue<PaymentMethod>
  ): DocumentData => ({
    default: paymentMethod.default,
    name: paymentMethod.name,
    url: paymentMethod.url,
    description: paymentMethod.description,
  }),
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): PaymentMethod => {
    const data = snapshot.data(options);

    return {
      id: snapshot.id,
      default: data.default,
      name: data.name,
      url: data.url,
      description: data.description,
    };
  },
};
