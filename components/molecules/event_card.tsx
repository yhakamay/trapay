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
  date: string;
  description?: string;
  imageUrl?: string;
  h?: string;
};

export default function EventCard(props: EventCardProps) {
  const {
    id,
    title,
    date,
    description,
    imageUrl = "https://source.unsplash.com/random",
    h,
  } = props;
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Link href={`/e/${id}`}>
      <Card w="sm" h={h} overflow="hidden">
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
