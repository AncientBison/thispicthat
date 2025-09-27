"use client";

import { Card, CardBody, CardFooter } from "@heroui/card";
import { Image } from "@heroui/image";
import { TrashIcon } from "@/components/icons";
import { Button } from "@heroui/button";
import { useSetAtom } from "jotai";
import { confirmDeleteModalOpenAtom, itemToDeleteAtom } from "@/atoms";

export default function ItemTile({
  name,
  image,
  id,
}: {
  name: string;
  image: string;
  id: string;
}) {
  const setConfirmDeleteModalOpen = useSetAtom(confirmDeleteModalOpenAtom);
  const setItemToDelete = useSetAtom(itemToDeleteAtom);

  return (
    <Card key={name} shadow="md" className="mb-4 break-inside-avoid">
      <CardBody className="overflow-visible p-0">
        <Image
          alt={name}
          className="w-full object-cover rounded-b-none"
          radius="lg"
          shadow="sm"
          src={`data:image/webp;base64,${image}`}
          width="100%"
        />
      </CardBody>
      <CardFooter className="flex justify-between">
        <span className="font-semibold">{name}</span>
        <Button
          isIconOnly
          variant="light"
          color="danger"
          onPress={() => {
            setConfirmDeleteModalOpen(true);
            setItemToDelete({ id, name });
          }}
        >
          <TrashIcon />
        </Button>
      </CardFooter>
    </Card>
  );
}
