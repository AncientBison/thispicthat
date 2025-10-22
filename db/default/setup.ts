import { createDefaultItems } from "@/db/default/itemCreator";
import { createDefaultCollections } from "@/db/default/collectionCreator";
import { locales } from "@/i18n/config";

export type Collection = {
  name: string;
  items: { name: string; fileName: string }[];
};

(async () => {
  for (const locale of locales) {
    await createDefaultItems(locale);
    await createDefaultCollections(locale);
  }
})();
