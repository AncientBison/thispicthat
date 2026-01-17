"use server";

import { ComfyApi, Workflow } from "comfyui-node";
import { getUserSettings, getUserIdOrThrow } from "@/db/user";
import { uploadToS3, getPresignedUrl } from "@/db/s3";
import { translateText } from "./translate";
import sharp from "sharp";
import workflowJson from "@/ai/workflow_api.json"; // Your exported API JSON

// Define your ComfyUI URL (Use env var in production)
const COMFY_API_URL = process.env.COMFY_API_URL || "http://127.0.0.1:8188";

export async function generateImage(prompt: string) {
  const { nativeLanguage } = await getUserSettings();
  await getUserIdOrThrow();

  try {
    // 1. Translate prompt if necessary
    const englishPrompt =
      nativeLanguage !== "en"
        ? await translateText(prompt, nativeLanguage, "en")
        : prompt;

    console.log(`Sending to ComfyUI: "${englishPrompt}"...`);

    // 2. Initialize ComfyUI Client
    const api = new ComfyApi(COMFY_API_URL);
    await api.ready(); // Ensure connection

    // 3. Load and Modify Workflow
    // IMPORTANT: Check your workflow_api.json to find the correct Node ID for your text input.
    // In standard default workflows, Node "6" is usually the Positive Prompt CLIPTextEncode.
    // Node "9" is usually the SaveImage node.
    const wf = Workflow.from(workflowJson)
      .set("6.inputs.text", englishPrompt) // <--- UPDATE THIS ID based on your JSON
      .set("3.inputs.seed", Math.floor(Math.random() * 1000000000)); // Randomize seed (Node 3 is usually KSampler)

    // 4. Run the Workflow
    // We expect the output to come from the SaveImage node (usually ID 9)
    const job = await api.run(wf);
    const result = await job.done();

    // 5. Retrieve Image Data
    // ComfyUI returns metadata about the generated image, we need to fetch the actual buffer.
    const outputImages = result.images?.["9"]; // <--- UPDATE THIS ID (The SaveImage node ID)
    
    if (!outputImages || outputImages.length === 0) {
      throw new Error("ComfyUI did not return an image.");
    }

    const imageMeta = outputImages[0];
    const imageFilename = imageMeta.filename;
    const imageSubfolder = imageMeta.subfolder;
    const imageType = imageMeta.type;

    // Fetch the raw image buffer from ComfyUI's view endpoint
    const imageUrl = `${COMFY_API_URL}/view?filename=${encodeURIComponent(
      imageFilename
    )}&subfolder=${encodeURIComponent(imageSubfolder)}&type=${imageType}`;

    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error("Failed to fetch image from ComfyUI server");
    
    const imageArrayBuffer = await response.arrayBuffer();
    const rawBuffer = Buffer.from(imageArrayBuffer);

    // 6. Process with Sharp (Resize/Format)
    const webpBuffer = await sharp(rawBuffer)
      .resize(512, 512, { fit: "cover" }) // Ensure consistent dimensions
      .webp({ quality: 90 })
      .toBuffer();

    // 7. Upload to S3
    const fileKey = `generated/${crypto.randomUUID()}.webp`;
    await uploadToS3(fileKey, webpBuffer, "image/webp");
    const finalUrl = await getPresignedUrl(fileKey);

    return {
      imageUrl: finalUrl,
      prompt: englishPrompt,
    };

  } catch (error: any) {
    console.error("Error generating image with ComfyUI:", error);
    throw new Error(`Failed to generate image: ${error.message}`);
  }
}