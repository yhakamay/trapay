import NextImage from "next/image";
import { VStack, Text } from "@chakra-ui/react";
import { useLocale } from "../../../locale";

export const SomethingWentWrong = () => {
  const { t } = useLocale();

  return (
    <VStack spacing="8">
      <NextImage src="/bug.svg" alt={"error"} width="200" height="200" />
      <Text>{t.somethingWentWrong}</Text>
    </VStack>
  );
};
