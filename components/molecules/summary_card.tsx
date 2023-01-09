import { Card, Heading, Stack, CardBody, Box, Text } from "@chakra-ui/react";
import { User as FirebaseUser } from "firebase/auth";
import { collection, DocumentReference } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Event } from "../../types/event";
import { Payment, paymentConverter } from "../../types/payment";
import { Transaction } from "../../types/transaction";
import { User, userConverter } from "../../types/user";
import Loading from "../atoms/loading";
import TransactionsList from "./transactions_list";

type SummaryCardProps = {
  user: FirebaseUser;
  eventRef: DocumentReference<Event>;
};

export default function SummaryCard(props: SummaryCardProps) {
  const { user, eventRef } = props;
  const paymentsRef = collection(eventRef, "payments").withConverter(
    paymentConverter
  );
  const [payments, loadingPayments] = useCollectionData(paymentsRef);
  const membersRef = collection(eventRef, "members").withConverter(
    userConverter
  );
  const [members, loadingMembers] = useCollectionData(membersRef);
  const intl = new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
  });
  const total = getTotal(payments ?? []);
  const formattedTotal = intl.format(total);
  const perPerson = getPerPerson(total, members ?? []);
  const formattedPerPerson = intl.format(perPerson);
  const transactions = getTransactions(members ?? [], payments ?? []);

  if (loadingPayments || loadingMembers) return <Loading />;

  return (
    <Card w={{ base: "sm", md: "lg" }} variant="outline">
      <CardBody>
        <Stack>
          <Heading size="sm">Total</Heading>
          <Text>{formattedTotal}</Text>
          <Heading size="sm">Per person</Heading>
          <Text>{`${formattedPerPerson} / person`}</Text>
          <Box h="4" />
          <TransactionsList
            eventId={eventRef.id}
            user={user}
            transactions={transactions}
          />
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
      // Calculate total payment amount for the member
      const paymentAmount = payments
        .filter((payment) => payment.paidBy.id === member.id)
        .reduce((acc, payment) => acc + payment.amount, 0);

      return {
        ...member,
        payment: paymentAmount,
      };
    });

    // Classify members into 3 categories: those who need to pay, those who need to receive, and those who have paid the average amount
    const membersNeedToPay: UserWithPaymentAmount[] = [];
    const membersNeedToReceive: UserWithPaymentAmount[] = [];
    const totalPayment = payments.reduce(
      (acc, payment) => acc + payment.amount,
      0
    );
    const perPerson = totalPayment / members.length;

    for (const member of membersWithPaymentAmount) {
      if (member.payment < perPerson) {
        membersNeedToPay.push(member);
      } else if (member.payment > perPerson) {
        membersNeedToReceive.push(member);
      }
    }

    // Generate transactions
    const transactions: Transaction[] = [];
    for (const memberNeedToReceive of membersNeedToReceive) {
      let amountToReceive = memberNeedToReceive.payment - perPerson;

      for (const memberNeedToPay of membersNeedToPay) {
        if (amountToReceive === 0) {
          break;
        }

        const amountToPay = Math.min(
          amountToReceive,
          perPerson - memberNeedToPay.payment
        );
        transactions.push({
          id: `${memberNeedToPay.id}-${memberNeedToReceive.id}`,
          from: memberNeedToPay,
          to: memberNeedToReceive,
          amount: amountToPay,
        });
        amountToReceive -= amountToPay;
        memberNeedToPay.payment += amountToPay;
        memberNeedToReceive.payment -= amountToPay;
      }
    }

    return transactions;
  }

  type UserWithPaymentAmount = User & { payment: number };
}
