import { auth } from "@/auth";
import ConfirmDeleteModal from "@/components/confirmDeleteModal";
import RemoveItemFromCollectionModal from "@/components/removeItemFromCollectionModal";
import ItemList from "@/components/itemList";
import NewItemModal from "@/components/newItemModal";
import { getCollectionsData } from "@/db/collections";
import { getItems } from "@/db/items";
import { Spinner } from "@heroui/spinner";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import NewCollectionModal from "@/components/newCollectionModal";
import { getUserSettings } from "@/db/user";

export default async function Home() {
  const itemsPromise = getItems();
  const collectionsDataPromise = getCollectionsData();
  const session = await auth();

  if (!session) {
    redirect("/signin");
  }

  try {
    await getUserSettings();
  } catch (error) {
    redirect("/welcome");
  }

  return (
    <>
      <ConfirmDeleteModal />
      <RemoveItemFromCollectionModal />
      <NewItemModal />
      <NewCollectionModal />
      <Suspense
        fallback={
          <div className="flex justify-center items-center w-full min-h-screen">
            <Spinner size="lg" />
          </div>
        }
      >
        <ItemList
          itemsPromise={itemsPromise}
          allItemsPromise={itemsPromise}
          collectionsDataPromise={collectionsDataPromise}
        />
      </Suspense>
    </>
  );
}
