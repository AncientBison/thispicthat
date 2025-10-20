"use client";

import { itemsAtom, collectionsAtom } from "@/atoms";
import ItemTile from "@/components/itemList/itemTile";
import { useAtom, useAtomValue } from "jotai";
import { use, useEffect } from "react";
import NewItemTile from "@/components/itemList/newItemTile";
import ItemCollectionTile from "@/components/itemList/itemCollectionTile";
import { Masonry } from "react-plock";
import StudyTile from "@/components/itemList/studyTile";
import CollectionAddTile from "@/components/itemList/collectionAddTile";
import NewCollectionTile from "@/components/itemList/newCollectionTile";

export default function ItemList({
  itemsPromise,
  allItemsPromise,
  collectionsDataPromise,
  hasNewItemTile = true,
  hasNewCollectionTile = true,
  collection,
}: {
  itemsPromise: Promise<{ name: string; image: string; id: string }[]>;
  allItemsPromise: Promise<{ name: string; image: string; id: string }[]>;
  collectionsDataPromise: Promise<
    {
      items: { name: string; image: string; id: string }[];
      name: string;
      id: string;
    }[]
  > | null;
  hasNewItemTile?: boolean;
  hasCollectionAddTile?: boolean;
  hasNewCollectionTile?: boolean;
  collection?: { id: string; name: string };
}) {
  const initialItems = use(itemsPromise);
  const initialCollections =
    collectionsDataPromise === null ? [] : use(collectionsDataPromise);

  const [collections, setCollectionsAtom] = useAtom(collectionsAtom);

  useEffect(() => {
    setCollectionsAtom((prev) =>
      JSON.stringify(prev || []) === JSON.stringify(initialCollections || [])
        ? prev
        : initialCollections
    );
  }, [initialCollections, setCollectionsAtom]);

  const [items, setItems] = useAtom(itemsAtom);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems, setItems]);

  const baseTiles: React.ReactNode[] = [];

  if (hasNewItemTile) {
    baseTiles.push(<NewItemTile key="new-item" />);
  }

  baseTiles.push(<StudyTile key="study-tile" collectionId={collection?.id} />);

  if (hasNewCollectionTile) {
    baseTiles.push(<NewCollectionTile key="new-collection" />);
  }

  if (collection !== undefined) {
    baseTiles.push(
      <CollectionAddTile
        key={`collection-add-${collection.id}`}
        collection={collection}
        collectionItems={items}
        allItemsPromise={allItemsPromise}
      />
    );
  }

  const collectionTiles = collections.map((collection) => (
    <ItemCollectionTile
      key={collection.id}
      items={collection.items}
      name={collection.name}
      id={collection.id}
    />
  ));
  const itemTiles = items.map((item) => (
    <ItemTile
      key={item.id}
      name={item.name}
      image={item.image}
      id={item.id}
      actionData={
        collection !== undefined
          ? { type: "removeFromCollection", collectionId: collection.id }
          : { type: "delete" }
      }
    />
  ));

  const masonryItems = [...baseTiles, ...collectionTiles, ...itemTiles];

  return (
    <Masonry
      config={{
        columns: [2, 3],
        gap: [16, 16],
        media: [768, 1280],
        useBalancedLayout: false,
      }}
      className="mx-auto p-4 max-w-6xl"
      items={masonryItems}
      render={(item) => item}
    />
  );
}
