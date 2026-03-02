export const LOCALES = ["en"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export function isLocaleSegment(seg?: string | null): seg is Locale {
  if (!seg) return false;
  return (LOCALES as readonly string[]).includes(seg);
}

