import { auth } from "@/auth";
import ConfirmDeleteModal from "@/components/confirmDeleteModal";
import ItemList from "@/components/itemList";
import { getItems } from "@/db/items";
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
      <Suspense fallback={<div>Loading...</div>}>
        <ItemList itemsPromise={itemsPromise} />
      </Suspense>
    </>
  );
}
