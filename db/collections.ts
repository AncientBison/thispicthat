import db from "@/db";
import { getUserIdOrThrow } from "@/db/user";
import { getItemsImages } from "@/db/items";

async function mapItemsWithImages(
  collectionItems: { item: { id: string; name: string } }[]
) {
  const itemIds = Array.from(new Set(collectionItems.map((ci) => ci.item.id)));
  const imageMap = await getItemsImages(itemIds);

  return collectionItems.map(({ item }) => {
    const image = imageMap.get(item.id);
    if (image === undefined) {
      throw new Error(`Image not found for item id: ${item.id}`);
    }

    return { id: item.id, name: item.name, image };
  });
}

export async function getCollectionsData() {
  const userId = await getUserIdOrThrow();

  const collections = await db.query.collections.findMany({
    where: (c, { eq }) => eq(c.userId, userId),
    orderBy: (c, { desc }) => desc(c.createdAt),
    with: {
      collectionItems: {
        limit: 4,
        with: {
          item: {
            columns: { id: true, name: true, image: false },
          },
        },
      },
    },
  });

  const allCollectionItems = collections.flatMap((c) => c.collectionItems);
  const allItemsWithImages = await mapItemsWithImages(allCollectionItems);
  const imageMap = new Map(allItemsWithImages.map((i) => [i.id, i.image]));

  return collections.map((collection) => ({
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
    where: (c, { and, eq }) =>
      and(eq(c.id, collectionId), eq(c.userId, userId)),
    with: {
      collectionItems: {
        with: {
          item: {
            columns: { id: true, name: true, image: false },
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
    where: (c, { and, eq }) =>
      and(eq(c.id, collectionId), eq(c.userId, userId)),
    columns: { name: true },
  });

  if (!collection) {
    throw new Error(
      "Collection not found or you do not have permission to access it"
    );
  }

  return collection.name;
}
