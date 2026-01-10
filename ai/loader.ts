import { pipeline } from "@huggingface/transformers";

declare global {
  var imageCaptioningCache: Awaited<ReturnType<typeof pipeline>> | undefined;
  var textGenerationCache: Awaited<ReturnType<typeof pipeline>> | undefined;
  var translationCache: Awaited<ReturnType<typeof pipeline>> | undefined;
}

async function getImageCaptioning() {
  if (!globalThis.imageCaptioningCache) {
    globalThis.imageCaptioningCache = await pipeline("image-to-text", "Xenova/vit-gpt2-image-captioning");
  }
  return globalThis.imageCaptioningCache;
}

async function getTextGeneration() {
  if (!globalThis.textGenerationCache) {
    globalThis.textGenerationCache = await pipeline("text2text-generation", "Xenova/flan-t5-small");
  }
  return globalThis.textGenerationCache;
}

async function getTranslation() {
  if (!globalThis.translationCache) {
    globalThis.translationCache = await pipeline("translation", "Xenova/nllb-200-distilled-600M");
  }
  return globalThis.translationCache;
}

export async function getPipeline() {
  const [imageCaptioning, textGeneration, translation] = await Promise.all([
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
