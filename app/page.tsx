import { auth } from "@/auth";
import ConfirmDeleteModal from "@/components/confirmDeleteModal";
import ItemList from "@/components/itemList";
import NewItemModal from "@/components/newItemModal";
import { getItems } from "@/db/items";
import { Spinner } from "@heroui/spinner";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function Home() {
  const itemsPromise = getItems();
  const session = await auth();

  if (!session) {
    redirect("/signin");
  }

  return (
    <>
      <ConfirmDeleteModal />
      <NewItemModal />
      <Suspense
        fallback={
          <div className="flex justify-center items-center w-full min-h-screen">
            <Spinner size="lg" />
          </div>
        }
      >
        <ItemList itemsPromise={itemsPromise} />
      </Suspense>
    </>
  );
}
