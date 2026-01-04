import { createDefaultItems } from "@/db/default/itemCreator";

export type Collection = {
  name: string;
  items: { name: string; fileName: string }[];
};

(async () => {
  await createDefaultItems();
})();
