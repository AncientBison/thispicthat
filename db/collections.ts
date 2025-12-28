"use server";

import db from "@/db";
import { getUserIdOrThrow, getUserSettings } from "@/db/user";
import { collectionItems, collections } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { getPresignedUrl } from "@/db/s3";

async function mapItemsWithImages(
  collectionItems: { item: { id: string; name: string; image: string } }[]
) {
  const uniqueItems = Array.from(
    new Map(collectionItems.map((ci) => [ci.item.id, ci.item])).values()
  );

  const urlMap = new Map<string, string>();
  await Promise.all(
    uniqueItems.map(async (item) => {
      const url = await getPresignedUrl(item.image);
      urlMap.set(item.id, url);
    })
  );

  return collectionItems.map(({ item }) => {
    const signedUrl = urlMap.get(item.id);
    if (!signedUrl) {
       throw new Error(`Failed to sign URL for item: ${item.id}`);
    }
    return { id: item.id, name: item.name, image: signedUrl };
  });
}

export async function getCollectionsData() {
  const userId = await getUserIdOrThrow();
  const userLearningLanguage = (await getUserSettings()).learningLanguage;

  const collectionsData = await db.query.collections.findMany({
    where: (collection, { eq, or, and, isNull }) =>
      or(
        eq(collection.userId, userId),
        and(
          isNull(collection.userId),
          eq(collection.language, userLearningLanguage)
        )
      ),
    orderBy: (collection, { desc }) => desc(collection.createdAt),
    with: {
      collectionItems: {
        with: {
          item: {
            columns: { id: true, name: true, image: true },
          },
        },
      },
    },
  });

  const allCollectionItems = collectionsData.flatMap(
    (collection) => collection.collectionItems
  );

  const allItemsWithImages = await mapItemsWithImages(allCollectionItems);
  
  const imageMap = new Map(
    allItemsWithImages.map((item) => [item.id, item.image])
  );

  return collectionsData.map((collection) => ({
    id: collection.id,
    name: collection.name,
    items: collection.collectionItems.map(({ item }) => ({
      id: item.id,
      name: item.name,
      image: imageMap.get(item.id)!,
    })),
  }));
}

export async function getCollectionItems(collectionId: string) {
  const userId = await getUserIdOrThrow();

  const collection = await db.query.collections.findFirst({
    where: (collection, { and, or, eq, isNull }) =>
      and(
        eq(collection.id, collectionId),
        or(eq(collection.userId, userId), isNull(collection.userId))
      ),
    with: {
      collectionItems: {
        with: {
          item: {
            columns: { id: true, name: true, image: true },
          },
        },
      },
    },
  });

  if (!collection) {
    throw new Error(
      "Collection not found or you do not have permission to access it"
    );
  }

  return mapItemsWithImages(collection.collectionItems);
}

export async function getCollectionNameFromId(collectionId: string) {
  const userId = await getUserIdOrThrow();

  const collection = await db.query.collections.findFirst({
    where: (collection, { and, eq, or, isNull }) =>
      and(
        eq(collection.id, collectionId),
        or(eq(collection.userId, userId), isNull(collection.userId))
      ),
    columns: { name: true },
  });

  if (!collection) {
    throw new Error(
      "Collection not found or you do not have permission to access it"
    );
  }

  return collection.name;
}

export async function setCollectionItems(
  collectionId: string,
  itemIds: string[]
) {
  const userId = await getUserIdOrThrow();

  const collection = await db.query.collections.findFirst({
    where: (collection, { and, eq }) =>
      and(eq(collection.id, collectionId), eq(collection.userId, userId)),
    columns: { id: true },
  });

  if (!collection) {
    throw new Error(
      "Collection not found or you do not have permission to access it"
    );
  }

  try {
    await db
      .delete(collectionItems)
      .where(eq(collectionItems.collectionId, collectionId));

    const rows = itemIds.map((itemId) => ({ collectionId, itemId }));
    await db.insert(collectionItems).values(rows);

    return await getCollectionItems(collectionId);
  } catch (error) {
    console.error("Failed to set collection items:", error);
    throw new Error("Failed to update collection items", { cause: error });
  }
}

export async function removeItemFromCollection(
  collectionId: string,
  itemId: string
) {
  const userId = await getUserIdOrThrow();

  const collection = await db.query.collections.findFirst({
    where: (collection, { and, eq }) =>
      and(eq(collection.id, collectionId), eq(collection.userId, userId)),
    columns: { id: true },
  });

  if (!collection) {
    throw new Error(
      "Collection not found or you do not have permission to access it"
    );
  }

  try {
    await db
      .delete(collectionItems)
      .where(
        and(
          eq(collectionItems.collectionId, collectionId),
          eq(collectionItems.itemId, itemId)
        )
      );
  } catch (error) {
    console.error("Failed to remove item from collection:", error);
    throw new Error("Failed to remove item from collection", { cause: error });
  }
}

export async function createCollection(name: string) {
  const userId = await getUserIdOrThrow();

  const userLearningLanguage = (await getUserSettings()).learningLanguage;

  try {
    const result = await db
      .insert(collections)
      .values({ name, userId, language: userLearningLanguage })
      .returning({ id: collections.id, name: collections.name });

    const created = result[0];
    return { id: created.id, name: created.name };
  } catch (error) {
    console.error("Failed to create collection:", error);
    throw new Error("Failed to create collection", { cause: error });
  }
}