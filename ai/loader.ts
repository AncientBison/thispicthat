import {
  pipeline,
  ImageToTextPipeline,
  Text2TextGenerationPipeline,
  TranslationPipeline,
} from "@huggingface/transformers";

declare global {
  var imageCaptioningCache: ImageToTextPipeline | undefined;
  var textGenerationCache: Text2TextGenerationPipeline | undefined;
  var translationCache: TranslationPipeline | undefined;
}

async function getImageCaptioning(): Promise<ImageToTextPipeline> {
  if (!globalThis.imageCaptioningCache) {
    const pipe = await pipeline(
      "image-to-text",
      "Xenova/vit-gpt2-image-captioning"
    );
    globalThis.imageCaptioningCache = pipe as ImageToTextPipeline;
  }
  return globalThis.imageCaptioningCache;
}

async function getTextGeneration(): Promise<Text2TextGenerationPipeline> {
  if (!globalThis.textGenerationCache) {
    const pipe = await pipeline("text2text-generation", "Xenova/flan-t5-small");
    globalThis.textGenerationCache = pipe as Text2TextGenerationPipeline;
  }
  return globalThis.textGenerationCache;
}

async function getTranslation(): Promise<TranslationPipeline> {
  if (!globalThis.translationCache) {
    const pipe = await pipeline(
      "translation",
      "Xenova/nllb-200-distilled-600M"
    );
    globalThis.translationCache = pipe as TranslationPipeline;
  }
  return globalThis.translationCache;
}

export async function getPipeline() {
  const [imageCaptioning, textGeneration, translation] =
    await Promise.all([
      getImageCaptioning(),
      getTextGeneration(),
      getTranslation(),
    ]);

  return {
    imageCaptioning,
    textGeneration,
    translation,
  };
}
