"use server";

import { ImageToTextOutput, RawImage } from "@huggingface/transformers";
import { getPipeline } from "@/ai/loader";
import { translateText } from "./translate";
import { getUserSettings } from "@/db/user";

export async function identifyImageSubject(imageFile: File) {
  const { learningLanguage } = await getUserSettings();

  try {
    const { imageCaptioning, textGeneration } = await getPipeline();

    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const image = await RawImage.fromBlob(new Blob([new Uint8Array(buffer)]));

    const captionResult = await imageCaptioning(image, {
      max_new_tokens: 50,
    }) as ImageToTextOutput;

    const caption = captionResult[0].generated_text.trim();

    const prompt = `Question: What is the main subject? Context: ${caption}`;

    const result = await textGeneration(prompt, {
      max_new_tokens: 20,
      num_beams: 3,
      length_penalty: -2.0,
      early_stopping: true,
    }) as ImageToTextOutput;

    const subject = result[0].generated_text;

    return translateText(subject, "en", learningLanguage);
  } catch (err) {
    console.error(err);
    throw new Error("AI identification failed", err as Error);
  }
}
