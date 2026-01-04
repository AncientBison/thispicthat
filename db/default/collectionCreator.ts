import fs from "fs";
import path from "path";

import db from "@/db";
import {
  collectionItems as collectionItemsTable,
  collections as collectionsTable,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { Collection } from "@/db/default/setup";
import { Locale } from "@/i18n/config";

export async function createDefaultCollectionsForUser(
  userId: string,
  learningLanguage: Locale,
  nativeLanguage: Locale
) {
  const itemsPath = path.resolve(
    process.cwd(),
    "db",
    "default",
    "items.json"
  );
  const raw = await fs.promises.readFile(itemsPath, "utf-8");
  const collections: {
    name: { [key in Locale]: string };
    id: string;
    items: { name: { [key in Locale]: string }; fileName: string }[];
  }[] = JSON.parse(raw);

  for (const collection of collections) {
    try {
      const learningName = collection.name[learningLanguage];
      const nativeName = collection.name[nativeLanguage];

      const finalName = nativeName && nativeName !== learningName
        ? `${learningName} (${nativeName})`
        : learningName;

      const insertResult = await db
        .insert(collectionsTable)
        .values({ name: finalName, userId, language: learningLanguage })
        .returning({ id: collectionsTable.id, name: collectionsTable.name });

      const created = insertResult[0];

      const rows = await db.query.items.findMany({
        where: (item, { and, isNull }) =>
          and(
            isNull(item.userId),
            eq(item.language, learningLanguage),
            eq(item.defaultItemCollectionName, learningName)
          ),
        columns: { id: true, name: true },
      });

      if (rows.length === 0) {
        throw new Error(
          `No items found for default collection ${learningName}`
        );
      }

      const nameToId = new Map(rows.map((row) => [row.name, row.id]));

      const collectionItemRows = collection.items
        .map((item) => {
          const itemName = item.name[learningLanguage];
          const itemId = nameToId.get(itemName);
          if (!itemId) return null;
          return { collectionId: created.id, itemId };
        })
        .filter(Boolean) as { collectionId: string; itemId: string }[];

      if (collectionItemRows.length > 0) {
        await db.insert(collectionItemsTable).values(collectionItemRows);
      }
    } catch (error) {
      console.error(
        `Failed to create collection ${collection.name[learningLanguage]} for user ${userId}:`,
        error
      );
    }
  }
}
