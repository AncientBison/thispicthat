"use server";

import { getPipeline } from "@/ai/loader";
import { getUserSettings } from "@/db/user";
import { Locale, localeToLanguageCode } from "@/i18n/config";
import { TranslationOutput } from "@huggingface/transformers";

export async function translateText(
  text: string,
  sourceLocale?: Locale,
  targetLocale?: Locale
) {
  try {
    const { translation } = await getPipeline();

    if (!sourceLocale || !targetLocale) {
      const userSettings = await getUserSettings();
      sourceLocale = userSettings.nativeLanguage;
      targetLocale = userSettings.learningLanguage;
    }

    const result = (await translation(text, {
      src_lang: localeToLanguageCode(sourceLocale),
      tgt_lang: localeToLanguageCode(targetLocale),
    } as any)) as TranslationOutput;

    return result[0].translation_text.charAt(0).toUpperCase() + result[0].translation_text.slice(1);
  } catch (err) {
    console.error(err);
    throw new Error("Translation failed", err as Error);
  }
}
