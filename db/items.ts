"use server";

import sharp from "sharp";
import db from "@/db";
import { items } from "@/db/schema";
import { auth } from "@/auth";
import env from "@/env";
import { and, eq } from "drizzle-orm";

export async function createItemEntry(item: { name: string; image: File }) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User not authenticated");
  }

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
  const session = await auth();

  const userId = session?.user?.id;

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
  const session = await auth();

  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User not authenticated");
  }

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
