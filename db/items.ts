"use server";

import sharp from "sharp";
import db from "@/db";
import { items } from "@/db/schema";
import env from "@/env";
import { and, eq } from "drizzle-orm";
import { getUserIdOrThrow } from "@/db/user";

export async function createItemEntry(item: { name: string; image: File }) {
  const userId = await getUserIdOrThrow();

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

  try {
    return (
      await db
        .insert(items)
        .values({
          userId,
          name: item.name,
          image: processedImage,
        })
        .returning({ id: items.id })
    )[0].id;
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
      .where(and(eq(items.id, itemId), eq(items.userId, userId)));

    if (result.rowCount === 0) {
      throw new Error(
        "Item entry not found or you do not have permission to delete it"
      );
    }
  } catch (error) {
    throw new Error("Failed to delete item entry", {
      cause: error,
    });
  }
}

export async function getItems() {
  const userId = await getUserIdOrThrow();

  const items = await db.query.items.findMany({
    where: (items, { eq }) => eq(items.userId, userId),
    orderBy: (items, { desc }) => desc(items.createdAt),
  });

  return items.map((item) => ({
    name: item.name,
    image: item.image.toString("base64"),
    id: item.id,
  }));
}

export async function getItemsImages(itemIds: string[]) {
  const uniqueIds = Array.from(new Set(itemIds));

  const imageRows =
    uniqueIds.length > 0
      ? await db.query.items.findMany({
          where: (item, { or, eq }) =>
            or(...uniqueIds.map((id) => eq(item.id, id))),
          columns: { id: true, image: true },
        })
      : [];

  return new Map(
    imageRows.map((r) => [
      r.id,
      typeof r.image === "string"
        ? r.image
        : Buffer.from(r.image as any).toString("base64"),
    ])
  );
}
