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

export async function createDefaultCollections(language: Locale) {
  const langPath = path.resolve(
    process.cwd(),
    "db",
    "default",
    `${language}.json`
  );
  const raw = await fs.promises.readFile(langPath, "utf-8");
  const collections: Collection[] = JSON.parse(raw);

  for (const collection of collections) {
    try {
      const insertResult = await db
        .insert(collectionsTable)
        .values({ name: collection.name, userId: null, language })
        .returning({ id: collectionsTable.id, name: collectionsTable.name });

      const created = insertResult[0];

      const itemNames = collection.items.map((item) => item.name);
      const rows = await db.query.items.findMany({
        where: (item, { or, and, isNull }) =>
          or(
            ...itemNames.map((n) => and(eq(item.name, n), isNull(item.userId)))
          ),
        columns: { id: true, name: true },
      });

      const nameToId = new Map(rows.map((row) => [row.name, row.id]));

      const collectionItemRows = collection.items
        .map((item) => {
          const itemId = nameToId.get(item.name);
          if (!itemId) return null;
          return { collectionId: created.id, itemId };
        })
        .filter(Boolean) as { collectionId: string; itemId: string }[];

      if (collectionItemRows.length > 0) {
        await db.insert(collectionItemsTable).values(collectionItemRows);
      }
    } catch (error) {
      console.error(`Failed to create collection ${collection.name}:`, error);
    }
  }
}
