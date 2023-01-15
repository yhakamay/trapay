import { Text } from "@chakra-ui/react";
import { useLocale } from "../../../locale";

type EventDateProps = {
  date: Date;
};

export default function EventDate(props: EventDateProps) {
  const { date } = props;
  const { locale } = useLocale();
  const formattedDate = new Date(date).toLocaleDateString(locale, {
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
