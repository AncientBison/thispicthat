import { createDefaultItems } from "@/db/default/itemCreator";
import { addCacheToAllObjects } from "./addCacheHeaders";

(async () => {
  await addCacheToAllObjects();
  await createDefaultItems();
})();
