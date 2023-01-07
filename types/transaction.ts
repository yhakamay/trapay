import { User } from "./user";

export type Transaction = {
  id: string;
  from: User;
  to: User;
  amount: number;
};
