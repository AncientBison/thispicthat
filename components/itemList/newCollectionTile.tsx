"use client";

import { Card, CardBody } from "@heroui/card";
import { AddFolderIcon } from "@/components/icons";
import { useSetAtom } from "jotai";
import { newCollectionModalOpenAtom, newCollectionNameAtom } from "@/atoms";
import { useTranslations } from "next-intl";

export default function NewCollectionTile() {
  const setNewCollectionModalOpen = useSetAtom(newCollectionModalOpenAtom);
  const setNewCollectionName = useSetAtom(newCollectionNameAtom);

  const t = useTranslations("ItemList");

  return (
    <Card
      shadow="md"
      className="break-inside-avoid w-full aspect-square hover:scale-[102%]"
      isPressable
      onPress={() => {
        setNewCollectionName("");
        setNewCollectionModalOpen(true);
      }}
    >
      <CardBody className="flex flex-col justify-center items-center">
        <AddFolderIcon size={"100%"} className="w-1/2 h-min" />
        <p className="font-bold">{t("newCollection")}</p>
      </CardBody>
    </Card>
  );
}
