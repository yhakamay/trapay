import { User as FirebaseUser } from "firebase/auth";
import {
  Stack,
  StackDivider,
  Heading,
  Box,
  Text,
  Button,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { Transaction } from "../../types/transaction";
import { useRouter } from "next/router";

type TransactionsListProps = {
  eventId: string;
  user: FirebaseUser;
  transactions: Transaction[];
};

export default function TransactionsList(props: TransactionsListProps) {
  const { eventId, user, transactions } = props;
  const router = useRouter();

  return (
    <Stack divider={<StackDivider />} spacing="4">
      {transactions.map((transaction) => {
        const { id, from, to } = transaction;
        const isPayee = transaction.to.id === user?.uid ?? false;
        const isPayer = transaction.from.id === user?.uid ?? false;
        const amount = Math.ceil(transaction.amount);
        const amountColor = isPayee
          ? "green.500"
          : isPayer
          ? "red.500"
          : undefined;
        const amountWeight = isPayee || isPayer ? "bold" : undefined;

        return (
          <Box key={id}>
            <HStack justify="space-between">
              <VStack align="start">
                <Heading size="sm">{`${from.name} → ${to.name}`}</Heading>
                <Text color={amountColor} fontWeight={amountWeight}>
                  {amount}
                </Text>
              </VStack>
              {isPayer && (
                <Button
                  onClick={() => {
                    onClickPay(to.id!);
                  }}
                >
                  Pay
                </Button>
              )}
            </HStack>
          </Box>
        );
      })}
    </Stack>
  );

  function onClickPay(toId: string) {
    router.push(`/p/${eventId}?to=${toId}`);
  }
}
