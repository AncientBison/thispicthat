import { auth } from "@/auth";
import ConfirmDeleteModal from "@/components/confirmDeleteModal";
import { BackArrowIcon } from "@/components/icons";
import ItemList from "@/components/itemList";
import NewItemModal from "@/components/newItemModal";
import { getCollectionItems, getCollectionNameFromId } from "@/db/collections";
import { Spinner } from "@heroui/spinner";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

export default async function Page({
  params,
}: {
  params: Promise<{ collection: string }>;
}) {
  const { collection: collectionId } = await params;

  if (collectionId === "") {
    notFound();
  }

  const itemsPromise = getCollectionItems(collectionId);
  const collectionName = await getCollectionNameFromId(collectionId);
  const session = await auth();

  if (!session) {
    redirect("/signin");
  }

  return (
    <>
      <header className="bg-neutral-300 dark:bg-neutral-700 grid grid-cols-[1fr_8fr_1fr] sticky">
        <Link href="/" className="my-auto ml-4 w-min">
          <BackArrowIcon />
        </Link>
        <p className="text-center font-bold py-2 text-2xl">{collectionName}</p>
      </header>
      <ConfirmDeleteModal />
      <NewItemModal />
      <Suspense
        fallback={
          <div className="flex justify-center items-center w-full min-h-screen">
            <Spinner size="lg" />
          </div>
        }
      >
        <ItemList
          itemsPromise={itemsPromise}
          hasNewItemTile={false}
          collectionsDataPromise={null}
          collectionId={collectionId}
        />
      </Suspense>
    </>
  );
}
