import { auth } from "@/auth";
import { BackArrowIcon } from "@/components/icons";
import Study from "@/components/study/study";
import { getCollectionItems, getCollectionNameFromId } from "@/db/collections";
import { getItems } from "@/db/items";
import { Spinner } from "@heroui/spinner";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function Page({
  params,
}: {
  params: Promise<{ collection?: string[] }>;
}) {
  const collectionId = (await params)?.collection?.[0];

  const t = await getTranslations("Study");

  const itemsPromise =
    collectionId === undefined ? getItems() : getCollectionItems(collectionId);
  const collectionName = collectionId
    ? await getCollectionNameFromId(collectionId)
    : undefined;

  const session = await auth();

  if (!session) {
    redirect("/signin");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-default-300/50 grid grid-cols-[1fr_8fr_1fr] sticky">
        <Link href="/" className="my-auto ml-4 w-min">
          <BackArrowIcon />
        </Link>
        <p className="text-center font-semibold py-2 text-2xl">
          {t.rich("title", {
            b: (children) => <span className="font-bold">{children}</span>,
            collection: collectionName ?? "_",
          })}
        </p>
      </header>
      <Suspense
        fallback={
          <div className="flex justify-center items-center w-full min-h-screen">
            <Spinner size="lg" />
          </div>
        }
      >
        <Study
          itemsPromise={itemsPromise}
          collection={
            collectionId === undefined
              ? undefined
              : { id: collectionId!, name: collectionName! }
          }
        />
      </Suspense>
    </div>
  );
}
