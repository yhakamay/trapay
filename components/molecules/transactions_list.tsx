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
        const isPayee = transaction.to.id === user?.uid ?? false;
        const isPayer = transaction.from.id === user?.uid ?? false;

        return (
          <Box key={transaction.id}>
            <HStack justify="space-between">
              <VStack align="start">
                <Heading size="xs">{`${transaction.from.name} → ${transaction.to.name}`}</Heading>
                <Text
                  pt="2"
                  fontSize="sm"
                  color={
                    isPayee ? "green.500" : isPayer ? "red.500" : undefined
                  }
                  fontWeight={isPayee || isPayer ? "bold" : undefined}
                >
                  {transaction.amount}
                </Text>
              </VStack>
              {isPayer && (
                <Button
                  onClick={() => {
                    router.push(`/p/${eventId}?to=${transaction.to.id}`);
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
}
