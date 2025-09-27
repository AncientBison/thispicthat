"use client";

import { itemsAtom } from "@/atoms";
import ItemTile from "@/components/itemList/itemTile";
import { useAtomValue } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import { use } from "react";
import NewItemTile from "@/components/itemList/NewItemTile";

export default function ItemList({
  itemsPromise,
}: {
  itemsPromise: Promise<{ name: string; image: string; id: string }[]>;
}) {
  const initialItems = use(itemsPromise);

  useHydrateAtoms([[itemsAtom, initialItems]]);

  const items = useAtomValue(itemsAtom);

  return (
    <div className="columns-1 md:columns-2 xl:columns-3 gap-4 p-4 max-w-6xl mx-auto">
      <NewItemTile />
      {items.map((item) => (
        <ItemTile
          key={item.id}
          name={item.name}
          image={item.image}
          id={item.id}
        />
      ))}
    </div>
  );
}
