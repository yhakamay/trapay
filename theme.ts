import {
  theme as baseTheme,
  extendTheme,
  withDefaultColorScheme,
  ThemeConfig,
} from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: true,
};

export const theme = extendTheme(
  {
    config,
    colors: {
      brand: baseTheme.colors.purple,
    },
  },
  withDefaultColorScheme({ colorScheme: "brand" })
);
