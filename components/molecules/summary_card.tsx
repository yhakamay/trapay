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
  const membersWithPaymentAmount = getMembersWithPaymentAmount(members ?? []);

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
            {membersWithPaymentAmount.map((member) => (
              <Box key={member.id}>
                <Heading size="xs">{member.name}</Heading>
                <Text pt="2" fontSize="sm">
                  {member.payment}
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

  function getMembersWithPaymentAmount(
    members: User[]
  ): UserWithPaymentAmount[] {
    return (
      members?.map((member) => {
        const paymentAmount = payments
          ?.filter((payment) => payment.paidBy.id === member.id)
          .reduce((acc, payment) => acc + payment.amount, 0);
        return {
          ...member,
          payment: paymentAmount,
        };
      }) ?? []
    );
  }
}

type UserWithPaymentAmount = User & {
  payment: number | undefined;
};
