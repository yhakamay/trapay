import {
  baseTheme,
  extendTheme,
  withDefaultColorScheme,
} from "@chakra-ui/react";

export const theme = extendTheme(
  {
    colors: {
      brand: baseTheme.colors.purple,
    },
  },
  withDefaultColorScheme({ colorScheme: "brand" })
);
