"use server";

import sharp from "sharp";
import db from "@/db";
import { items } from "@/db/schema";
import env from "@/env";
import { and, eq } from "drizzle-orm";
import { getUserIdOrThrow, getUserSettings } from "@/db/user";
import { uploadToS3, deleteFromS3, getPresignedUrl } from "@/db/s3";

export async function createItemEntry(item: { name: string; image: File }) {
  const userId = await getUserIdOrThrow();
  const userLearningLanguage = (await getUserSettings()).learningLanguage;

  const buffer = Buffer.from(await item.image.arrayBuffer());

  const processedImage = await sharp(buffer)
    .resize({
      width: env.MAX_IMAGE_DIMENSION,
      height: env.MAX_IMAGE_DIMENSION,
      fit: "inside",
      withoutEnlargement: true,
    })
    .toFormat("webp", { quality: 80, effort: 4 })
    .toBuffer();

  const fileKey = `${crypto.randomUUID()}.webp`;

  try {
    await uploadToS3(fileKey, processedImage, "image/webp");

    return {
      id: (
        await db
          .insert(items)
          .values({
            userId,
            name: item.name,
            image: fileKey,
            language: userLearningLanguage,
          })
          .returning({ id: items.id })
      )[0].id,
      imageUrl: await getPresignedUrl(fileKey),
    };
  } catch (error) {
    console.error("Error logging item entry:", error);
    throw new Error("Failed to log item entry", {
      cause: error,
    });
  }
}

export async function deleteItemEntry(itemId: string) {
  const userId = await getUserIdOrThrow();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  try {
    const result = await db
      .delete(items)
      .where(and(eq(items.id, itemId), eq(items.userId, userId)))
      .returning({ imageKey: items.image });

    if (result.length === 0) {
      throw new Error(
        "Item entry not found or you do not have permission to delete it"
      );
    }

    const imageKey = result[0].imageKey;
    if (imageKey) {
      await deleteFromS3(imageKey).catch((error) => {
        console.error(`Failed to delete S3 object ${imageKey}`, error);
      });
    }
  } catch (error) {
    throw new Error("Failed to delete item entry", {
      cause: error,
    });
  }
}

export async function getItems() {
  const userId = await getUserIdOrThrow();
  const userLearningLanguage = (await getUserSettings()).learningLanguage;

  const dbItems = await db.query.items.findMany({
    where: (items, { eq, or, isNull }) =>
      or(
        eq(items.userId, userId),
        and(isNull(items.userId), eq(items.language, userLearningLanguage))
      ),
    orderBy: (items, { desc }) => desc(items.createdAt),
  });

  const itemsWithUrls = await Promise.all(
    dbItems.map(async (item) => {
      const url = await getPresignedUrl(item.image);

      return {
        name: item.name,
        image: url,
        id: item.id,
      };
    })
  );

  return itemsWithUrls;
}

export async function getItemsImages(itemIds: string[]) {
  const uniqueIds = Array.from(new Set(itemIds));

  if (uniqueIds.length === 0) return new Map();

  const imageRows = await db.query.items.findMany({
    where: (item, { or, eq }) => or(...uniqueIds.map((id) => eq(item.id, id))),
    columns: { id: true, image: true },
  });

  const rowsWithUrls = await Promise.all(
    imageRows.map(async (r) => {
      const url = await getPresignedUrl(r.image);
      return [r.id, url] as const;
    })
  );

  return new Map(rowsWithUrls);
}
