import fs from "fs";
import path from "path";
import sharp from "sharp";
import db from "@/db";
import { items } from "@/db/schema";
import env from "@/env";
import { Collection } from "@/db/default/setup";
import { Locale } from "@/i18n/config";
import { uploadToS3 } from "@/db/s3";

export async function createDefaultItems(language: Locale) {
  const langPath = path.resolve(
    process.cwd(),
    "db",
    "default",
    `${language}.json`
  );
  const raw = await fs.promises.readFile(langPath, "utf-8");
  const collections: Collection[] = JSON.parse(raw);

  for (const collection of collections) {
    for (const itemData of collection.items) {
      const fileName = `${itemData.fileName}.webp`;
      const filePath = path.resolve(
        process.cwd(),
        "db",
        "default",
        "items",
        fileName
      );

      try {
        // 1. Check if item already exists in DB
        const existing = await db.query.items.findFirst({
          where: (item, { eq, isNull, and }) =>
            and(
              eq(item.name, itemData.name),
              eq(item.language, language),
              isNull(item.userId)
            ),
          columns: { id: true },
        });

        if (existing) {
          console.info(
            `Default item already exists for ${itemData.name} (${language}), skipping creation.`
          );
          continue;
        }

        // 2. Read and Process Image
        const buffer = await fs.promises.readFile(filePath);

        const processedImage = await sharp(buffer)
          .resize({
            width: env.MAX_IMAGE_DIMENSION,
            height: env.MAX_IMAGE_DIMENSION,
            fit: "inside",
            withoutEnlargement: true,
          })
          .toFormat("webp", { quality: 80, effort: 4 })
          .toBuffer();

        // 3. Generate S3 Key and Upload
        // We use a UUID to ensure no collisions in the bucket
        const s3Key = `${crypto.randomUUID()}.webp`;
        
        await uploadToS3(s3Key, processedImage, "image/webp");

        // 4. Insert into DB with the S3 Key
        await db.insert(items).values({
          userId: null,
          name: itemData.name,
          image: s3Key, // Store the string key, not the buffer
          language,
        });

        console.log(`Seeded item: ${itemData.name}`);

      } catch (error) {
        console.error(
          `Failed to create item for ${itemData.name} from ${filePath}:`,
          error
        );
      }
    }
  }
}