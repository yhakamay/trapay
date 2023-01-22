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
  Badge,
} from "@chakra-ui/react";
import { Transaction } from "../../types/transaction";
import { useRouter } from "next/router";
import { useLocale } from "../../locale";

type TransactionsListProps = {
  eventId: string;
  user: FirebaseUser;
  transactions: Transaction[];
};

export default function TransactionsList(props: TransactionsListProps) {
  const { eventId, user, transactions } = props;
  const router = useRouter();
  const intl = new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
  });
  const { t } = useLocale();

  return (
    <Stack divider={<StackDivider />} spacing="4">
      {transactions.map((transaction) => {
        const { id, from, to, amount } = transaction;

        if (amount === 0) {
          return null;
        }

        const isPayee = transaction.to.id === user?.uid ?? false;
        const isPayer = transaction.from.id === user?.uid ?? false;
        const ceiledAmount = Math.ceil(amount);
        const formattedAmount = intl.format(ceiledAmount);
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
                <HStack>
                  <Text color={amountColor} fontWeight={amountWeight}>
                    {formattedAmount}
                  </Text>
                  {isPayee && <Badge colorScheme="green">receive</Badge>}
                  {isPayer && <Badge colorScheme="red">pay</Badge>}
                </HStack>
              </VStack>
              {isPayer && (
                <Button
                  size="sm"
                  onClick={() => {
                    onClickPay(to.id!);
                  }}
                >
                  {t.pay}
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
