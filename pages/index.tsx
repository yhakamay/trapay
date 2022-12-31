import Head from "next/head";
import { Box, Wrap, WrapItem } from "@chakra-ui/react";
import { events } from "../events";
import EventCard from "../components/molecules/event_card";

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
            <>
              <WrapItem>
                <EventCard
                  key={event.id}
                  id={event.id.toString()}
                  title={event.title}
                  createdAt={event.createdAt}
                  description={event.description}
                />
              </WrapItem>
            </>
          ))}
        </Wrap>
      </Box>
    </>
  );
}
