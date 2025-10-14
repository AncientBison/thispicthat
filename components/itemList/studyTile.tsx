"use client";

import { Card, CardBody } from "@heroui/card";
import { BookIcon } from "@/components/icons";
import { useSetAtom } from "jotai";
import { newItemModalOpenAtom, itemNameAtom, itemImageAtom } from "@/atoms";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function StudyTile({
  collectionName,
}: {
  collectionName?: string;
}) {
  const setNewItemModalOpen = useSetAtom(newItemModalOpenAtom);
  const setItemName = useSetAtom(itemNameAtom);
  const setItemImage = useSetAtom(itemImageAtom);

  const t = useTranslations("ItemList");

  return (
    <Link
      href={
        collectionName === undefined ? "/study" : `/study/${collectionName}`
      }
    >
      <Card
        shadow="md"
        className="break-inside-avoid w-full aspect-square hover:scale-[102%]"
        isPressable
      >
        <CardBody className="flex flex-col justify-center items-center">
          <BookIcon size={"100%"} className="w-1/2 h-min" />
          <p className="font-bold">{t("study")}</p>
        </CardBody>
      </Card>
    </Link>
  );
}
