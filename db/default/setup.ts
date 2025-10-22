import { createDefaultItems } from "@/db/default/itemCreator";
import { createDefaultCollections } from "@/db/default/collectionCreator";

export type Collection = {
  name: string;
  items: { name: string; fileName: string }[];
}

(async () => {
	await createDefaultItems("en");
	await createDefaultCollections("en");
})();