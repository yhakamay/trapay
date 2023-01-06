import NextImage from "next/image";
import {
  Card,
  CardBody,
  CardHeader,
  Container,
  Heading,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";

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
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
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
          <Heading>{title}</Heading>
          <Text>{formattedDate}</Text>
          <Text>{description}</Text>
        </CardBody>
      </Card>
    </Link>
  );
}
