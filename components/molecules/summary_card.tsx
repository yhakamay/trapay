import {
  Card,
  Heading,
  Stack,
  CardBody,
  Box,
  Text,
  StackDivider,
} from "@chakra-ui/react";
import { collection, DocumentReference } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Event } from "../../types/event";
import { Payment, paymentConverter } from "../../types/payment";
import { Transaction } from "../../types/transaction";
import { User, userConverter } from "../../types/user";
import Loading from "../atoms/loading";

type SummaryCardProps = {
  eventRef: DocumentReference<Event>;
};

export default function SummaryCard(props: SummaryCardProps) {
  const { eventRef } = props;
  const paymentsRef = collection(eventRef, "payments").withConverter(
    paymentConverter
  );
  const [payments, loadingPayments] = useCollectionData(paymentsRef);
  const membersRef = collection(eventRef, "members").withConverter(
    userConverter
  );
  const [members, loadingMembers] = useCollectionData(membersRef);
  const total = getTotal(payments ?? []);
  const perPerson = getPerPerson(total, members ?? []);
  const transactions = getTransactions(members ?? [], payments ?? []);

  if (loadingPayments || loadingMembers) return <Loading />;

  return (
    <Card w={{ base: "sm", md: "lg" }} variant="outline">
      <CardBody>
        <Stack>
          <Heading size="sm">Total</Heading>
          <Text>{total}</Text>
          <Heading size="sm">Per person</Heading>
          <Text>{`${perPerson} / person`}</Text>
          <Box h="4" />
          <Stack divider={<StackDivider />} spacing="4">
            {transactions.map((transaction) => (
              <Box key={transaction.id}>
                <Heading size="xs">{`${transaction.from.name} → ${transaction.to.name}`}</Heading>
                <Text pt="2" fontSize="sm">
                  {transaction.amount}
                </Text>
              </Box>
            ))}
          </Stack>
        </Stack>
      </CardBody>
    </Card>
  );

  function getTotal(payments: Payment[]): number {
    return payments?.reduce((acc, payment) => acc + payment.amount, 0) ?? 0;
  }

  function getPerPerson(total: number, members: User[]): number {
    return Math.ceil(total / (members?.length ?? 1));
  }

  // Calculate who should pay to whom
  function getTransactions(
    members: User[],
    payments: Payment[]
  ): Transaction[] {
    // Sort members by their payment amount
    const membersWithPaymentAmount = members.map((member) => {
      const payment = payments.find(
        (payment) => payment.paidBy.id === member.id
      );
      return {
        ...member,
        payment: payment?.amount ?? 0,
      };
    });
    const sortedMembers = membersWithPaymentAmount.sort(
      (a, b) => a.payment - b.payment
    );
    const transactions: Transaction[] = [];
    const membersNeedToPay: UserWithPaymentAmount[] = [];
    const membersNeedToReceive: UserWithPaymentAmount[] = [];

    // Find members who need to pay and receive
    for (const member of sortedMembers) {
      if (member.payment === perPerson) continue;

      if (member.payment < perPerson) {
        membersNeedToPay.push(member);
      }

      if (member.payment > perPerson) {
        membersNeedToReceive.push(member);
      }
    }

    for (const memberNeedToReceive of membersNeedToReceive) {
      let amount = memberNeedToReceive.payment - perPerson;

      for (const memberNeedToPay of membersNeedToPay) {
        if (amount === 0) break;

        if (memberNeedToPay.payment === perPerson) continue;

        const amountToPay = Math.min(
          amount,
          perPerson - memberNeedToPay.payment
        );
        transactions.push({
          id: `${memberNeedToPay.id}-${memberNeedToReceive.id}`,
          from: memberNeedToPay,
          to: memberNeedToReceive,
          amount: amountToPay,
        });
        amount -= amountToPay;
        memberNeedToPay.payment += amountToPay;
        memberNeedToReceive.payment -= amountToPay;
      }
    }

    return transactions;
  }

  type UserWithPaymentAmount = User & { payment: number };
}
