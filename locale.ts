import { useRouter } from "next/router";
import en from "./src/locales/en";
import ja from "./src/locales/ja";

export const useLocale = () => {
  const { locale } = useRouter();
  const t = locale == "en" ? en : ja;
  const flag = locale == "en" ? "🇺🇸" : "🇯🇵";

  return { locale, t, flag };
};
