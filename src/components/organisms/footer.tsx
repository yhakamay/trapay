import { Box } from "@chakra-ui/react";

export default function Footer() {
  return (
    <Box as="section" pb={{ base: "12", md: "24" }}>
      <Box as="nav" px={{ base: "4", md: "8" }} py="4"></Box>
    </Box>
  );
}
