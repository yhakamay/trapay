import { Text } from "@chakra-ui/react";

type EventDateProps = {
  date: Date;
};

export default function EventDate(props: EventDateProps) {
  const { date } = props;
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Text color="grey" fontSize="sm">
      {formattedDate}
    </Text>
  );
}
