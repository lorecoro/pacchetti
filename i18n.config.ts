import { createNavigation } from "next-intl/navigation";

export const locales = ["en", "it"] as const;
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  "en": "English",
  "it": "Italiano",
};

export const { Link, usePathname, useRouter } = createNavigation({ locales });