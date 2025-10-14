"use client";

import { itemsAtom } from "@/atoms";
import ItemTile from "@/components/itemList/itemTile";
import { useAtomValue } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import { use } from "react";
import NewItemTile from "@/components/itemList/newItemTile";
import ItemCollectionTile from "@/components/itemList/itemCollectionTile";
import { Masonry } from "react-plock";
import StudyTile from "@/components/itemList/studyTile";

export default function ItemList({
  itemsPromise,
  collectionsPromise,
  hasNewItemTile = true,
  collectionName
}: {
  itemsPromise: Promise<{ name: string; image: string; id: string }[]>;
  collectionsPromise: Promise<
    {
      items: { name: string; image: string; id: string }[];
      name: string;
    }[]
  > | null;
  hasNewItemTile?: boolean;
  collectionName?: string;
}) {
  const initialItems = use(itemsPromise);
  const collections =
    collectionsPromise === null ? [] : use(collectionsPromise);

  useHydrateAtoms([[itemsAtom, initialItems]]);

  const items = useAtomValue(itemsAtom);

  return (
    <Masonry
      config={{
        columns: [2, 3],
        gap: [16, 16],
        media: [768, 1280],
        useBalancedLayout: false,
      }}
      className="mx-auto p-4 max-w-6xl"
      items={(hasNewItemTile
        ? [<NewItemTile />, <StudyTile collectionName={collectionName} />]
        : [<StudyTile collectionName={collectionName} />]
      )
        .concat(
          collections.map((collection) => (
            <ItemCollectionTile
              items={collection.items}
              name={collection.name}
              key={collection.name}
            />
          ))
        )
        .concat(
          items.map((item) => (
            <ItemTile
              key={item.id}
              name={item.name}
              image={item.image}
              id={item.id}
            />
          ))
        )}
      render={(item) => {
        return item;
      }}
    />
  );
}
