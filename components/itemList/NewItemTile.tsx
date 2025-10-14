"use client";

import { Card, CardBody } from "@heroui/card";
import { AddCircleIcon } from "@/components/icons";
import { useSetAtom } from "jotai";
import { newItemModalOpenAtom, itemNameAtom, itemImageAtom } from "@/atoms";
import { useTranslations } from "next-intl";

export default function NewItemTile() {
  const setNewItemModalOpen = useSetAtom(newItemModalOpenAtom);
  const setItemName = useSetAtom(itemNameAtom);
  const setItemImage = useSetAtom(itemImageAtom);

  const t = useTranslations("ItemList");

  return (
    <Card
      shadow="md"
      className="break-inside-avoid w-full aspect-square hover:scale-[102%]"
      isPressable
      onPress={() => {
        setItemName("");
        setItemImage(null);
        setNewItemModalOpen(true);
      }}
    >
      <CardBody className="flex flex-col justify-center items-center">
        <AddCircleIcon size={"100%"} className="w-1/2 h-min" />
        <p className="font-bold">{t("addItem")}</p>
      </CardBody>
    </Card>
  );
}
