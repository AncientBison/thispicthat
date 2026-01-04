import fs from "fs";
import path from "path";
import sharp from "sharp";
import db from "@/db";
import { items } from "@/db/schema";
import env from "@/env";
import { Collection } from "@/db/default/setup";
import { Locale, locales } from "@/i18n/config";
import { uploadToS3 } from "@/db/s3";

export async function createDefaultItems() {
  const itemsPath = path.resolve(process.cwd(), "db", "default", "items.json");

  const raw = await fs.promises.readFile(itemsPath, "utf-8");
  const collections: {
    name: { [key in Locale]: string };
    id: string;
    items: { name: { [key in Locale]: string }; fileName: string }[];
  }[] = JSON.parse(raw);

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

      const s3Key = `${crypto.randomUUID()}.webp`;

      let anyOfItemExists = false;

      for (const language of locales) {
        const existing = await db.query.items.findFirst({
          where: (item, { eq, isNull, and }) =>
            and(
              eq(item.name, itemData.name[language]),
              eq(item.language, language),
              isNull(item.userId),
              eq(item.defaultItemCollectionName, collection.name[language])
            ),
          columns: { id: true },
        });

        if (existing) {
          anyOfItemExists = true;

          console.info(
            `Default item already exists for ${itemData.name[language]} (${language}), skipping creation.`
          );
          continue;
        }

        await db.insert(items).values({
          userId: null,
          name: itemData.name[language],
          image: s3Key,
          language,
          defaultItemCollectionName: collection.name[language],
        });

        console.log(`Seeded item: ${itemData.name[language]}`);
      }

      if (!anyOfItemExists) {
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

        await uploadToS3(s3Key, processedImage, "image/webp");

        console.log(`Seeded image: ${itemData.fileName}`);
      }
    }
  }
}
