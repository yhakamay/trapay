import NextImage from "next/image";
import { Text, VStack } from "@chakra-ui/react";

type NoItemsProps = {
  text: string;
};

export default function NoItems(props: NoItemsProps) {
  const { text } = props;

  return (
    <VStack spacing="8">
      <NextImage src="/void.svg" alt="no items" width="200" height="200" />
      <Text>{text}</Text>
    </VStack>
  );
}
