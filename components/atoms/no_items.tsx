import NextImage from "next/image";
import { Box, Text, VStack } from "@chakra-ui/react";

type NoItemsProps = {
  text: string;
};

export default function NoItems(props: NoItemsProps) {
  const { text } = props;

  return (
    <VStack>
      <NextImage src="/void.svg" alt="no items" width="300" height="300" />
      <Box h="8" />
      <Text>{text}</Text>
    </VStack>
  );
}
