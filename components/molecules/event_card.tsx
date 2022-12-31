import {
  Card,
  CardBody,
  CardHeader,
  Heading,
  Image,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";

type EventCardProps = {
  id: string;
  title: string;
  createdAt: string;
  description?: string;
  imageUrl?: string;
};

export default function EventCard(props: EventCardProps) {
  const {
    id,
    title,
    createdAt,
    description,
    imageUrl = "https://source.unsplash.com/random",
  } = props;
  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Link href={`/e/${id}`}>
      <Card>
        <CardHeader>
          <Image src={imageUrl} alt="" fit="cover" w="full" h="3xs" />
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
