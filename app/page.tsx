import ConfirmDeleteModal from "@/components/confirmDeleteModal";
import ItemList from "@/components/itemList";
import { getItems } from "@/db/items";
import { Suspense } from "react";

export default function Home() {
  const items = getItems();

  return (
    <>
      <ConfirmDeleteModal />
      <Suspense fallback={<div>Loading...</div>}>
        <ItemList itemsPromise={items} />
      </Suspense>
    </>
  );
}
