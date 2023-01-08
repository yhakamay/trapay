import { User as FirebaseUser } from "firebase/auth";
import { Stack, StackDivider, Heading, Box, Text } from "@chakra-ui/react";
import { Transaction } from "../../types/transaction";

type TransactionsListProps = {
  user: FirebaseUser;
  transactions: Transaction[];
};

export default function TransactionsList(props: TransactionsListProps) {
  const { user, transactions } = props;

  return (
    <Stack divider={<StackDivider />} spacing="4">
      {transactions.map((transaction) => {
        const isPayee = transaction.to.id === user?.uid ?? false;
        const isPayer = transaction.from.id === user?.uid ?? false;

        return (
          <Box key={transaction.id}>
            <Heading size="xs">{`${transaction.from.name} → ${transaction.to.name}`}</Heading>
            <Text
              pt="2"
              fontSize="sm"
              color={isPayee ? "green.500" : isPayer ? "red.500" : undefined}
              fontWeight={isPayee || isPayer ? "bold" : undefined}
            >
              {transaction.amount}
            </Text>
          </Box>
        );
      })}
    </Stack>
  );
}
