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
  const languagePath = path.resolve(
    process.cwd(),
    "db",
    "default",
    `${learningLanguage}.json`
  );
  const raw = await fs.promises.readFile(languagePath, "utf-8");
  const collections: Collection[] = JSON.parse(raw);

  const nativeLanguagePath = path.resolve(
    process.cwd(),
    "db",
    "default",
    `${nativeLanguage}.json`
  );
  let nativeCollections: Collection[] = [];
  try {
    const nativeRaw = await fs.promises.readFile(nativeLanguagePath, "utf-8");
    nativeCollections = JSON.parse(nativeRaw);
  } catch (err) {
    console.warn(
      `Could not read native language defaults for ${nativeLanguage}:`,
      err
    );
  }

  for (const collection of collections) {
    try {
      let nativeName: string | undefined;
      if (nativeCollections.length > 0) {
        const learningFileNames = new Set(
          collection.items.map((i) => (i as any).fileName).filter(Boolean)
        );

        let bestIndex = -1;
        let bestMatches = 0;
        nativeCollections.forEach((nativeCollection, idx) => {
          const nativeFileNames = new Set(
            nativeCollection.items.map((item) => item.fileName).filter(Boolean)
          );
          let matches = 0;
          learningFileNames.forEach((fileName) => {
            if (nativeFileNames.has(fileName)) matches++;
          });
          if (matches > bestMatches) {
            bestMatches = matches;
            bestIndex = idx;
          }
        });

        if (bestIndex >= 0 && bestMatches > 0) {
          nativeName = nativeCollections[bestIndex].name;
        }
      }

      const finalName = nativeName
        ? `${collection.name} (${nativeName})`
        : collection.name;

      const insertResult = await db
        .insert(collectionsTable)
        .values({ name: finalName, userId, language: learningLanguage })
        .returning({ id: collectionsTable.id, name: collectionsTable.name });

      const created = insertResult[0];

      const itemNames = collection.items.map((item) => item.name);
      const rows = await db.query.items.findMany({
        where: (item, { or, and, isNull }) =>
          and(
            or(...itemNames.map((name) => eq(item.name, name))),
            isNull(item.userId),
            eq(item.language, learningLanguage)
          ),
        columns: { id: true, name: true },
      });

      if (rows.length === 0) {
        throw new Error(
          `No items found for default collection ${collection.name}`
        );
      }

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
      console.error(
        `Failed to create collection ${collection.name} for user ${userId}:`,
        error
      );
    }
  }
}
