export type Locale = (typeof locales)[number];

export const locales = ["en", "fr", "es"] as const;

export function localeToLanguageCode(locale: Locale): string {
  switch (locale) {
    case "en":
      return "eng_Latn";
    case "fr":
      return "fra_Latn";
    case "es":
      return "spa_Latn";
  }
}
