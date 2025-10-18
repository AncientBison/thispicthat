"use client";

import { Card, CardBody } from "@heroui/card";
import { AddStackIcon } from "@/components/icons";
import { useSetAtom } from "jotai";
import { collectionAddModalOpenAtom } from "@/atoms";
import { useTranslations } from "next-intl";
import CollectionAddModal from "@/components/collectionAddModal";

export default function CollectionAddTile({
  collection,
  collectionItems,
  allItemsPromise,
}: {
  collection: { id: string; name: string };
  collectionItems: { name: string; image: string; id: string }[];
  allItemsPromise: Promise<{ name: string; image: string; id: string }[]>;
}) {
  const setCollectionAddModalOpen = useSetAtom(collectionAddModalOpenAtom);

  const t = useTranslations("ItemList");

  return (
    <>
      <CollectionAddModal
        collectionItems={collectionItems}
        allItemsPromise={allItemsPromise}
        collection={{ id: collection.id, name: collection.name }}
      />
      <Card
        shadow="md"
        className="break-inside-avoid w-full aspect-square hover:scale-[102%]"
        isPressable
        onPress={() => {
          setCollectionAddModalOpen(true);
        }}
      >
        <CardBody className="flex flex-col justify-center items-center">
          <AddStackIcon size={"100%"} className="w-1/2 h-min" />
          <p className="font-bold">{t("collectionAdd")}</p>
        </CardBody>
      </Card>
    </>
  );
}
