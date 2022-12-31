import Head from "next/head";
import { Box, Wrap } from "@chakra-ui/react";
import { EventCard } from "../components/molecules/event_card";
import { events } from "../events";

export default function Home() {
  return (
    <>
      <Head>
        <title>TraPay</title>
        <meta
          name="description"
          content="Split the bill with your friends easily!"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box px={{ base: "4", md: "8" }}>
        <Wrap>
          {events.map((event) => (
            <EventCard
              key={event.id}
              id={event.id.toString()}
              title={event.title}
              createdAt={event.createdAt}
              description={event.description}
            />
          ))}
        </Wrap>
      </Box>
    </>
  );
}
