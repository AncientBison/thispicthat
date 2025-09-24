import ItemList from "@/components/itemList";
import { getItems } from "@/db/items";
import { Suspense } from "react";

export default async function Home() {
  const items = await getItems();

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <ItemList items={items} />
      </Suspense>
    </>
  );
}
