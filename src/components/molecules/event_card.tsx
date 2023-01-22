import NextImage from "next/image";
import {
  Card,
  CardBody,
  CardHeader,
  Container,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import Link from "next/link";
import { useLocale } from "../../locale";

type EventCardProps = {
  id: string;
  title: string;
  date: string;
  description?: string;
  imageUrl?: string;
  h?: string;
};

export default function EventCard(props: EventCardProps) {
  const { id, title, date, description, imageUrl = "/friends.svg", h } = props;
  const { locale } = useLocale();
  const formattedDate = new Date(date).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Link href={`/e/${id}`}>
      <Card w="sm" h={h} overflow="hidden" variant="outline">
        <CardHeader>
          <Container w="full" h="100" overflow="hidden" position="relative">
            <NextImage
              src={imageUrl}
              alt="cover"
              fill={true}
              style={{ objectFit: "contain" }}
            />
          </Container>
        </CardHeader>
        <CardBody>
          <VStack spacing="2" align="start">
            <Heading size="lg">{title}</Heading>
            <Text>{formattedDate}</Text>
            <Text>{description}</Text>
          </VStack>
        </CardBody>
      </Card>
    </Link>
  );
}
