import fs from "fs";
import path from "path";
import sharp from "sharp";
import db from "@/db";
import { items } from "@/db/schema";
import env from "@/env";
import { Collection } from "@/db/default/setup";
import { Locale } from "@/i18n/config";

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

        await db.insert(items).values({
          userId: null,
          name: itemData.name,
          image: processedImage,
          language,
        });
      } catch (error) {
        console.error(
          `Failed to create item for ${itemData.name} from ${filePath}:`,
          error
        );
      }
    }
  }
}
