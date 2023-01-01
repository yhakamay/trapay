import { User } from "./user";

export type Payment = {
  id: string;
  title: string;
  amount: number;
  createdAt: string;
  paidBy: User;
};
