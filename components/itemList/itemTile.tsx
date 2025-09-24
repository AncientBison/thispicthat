"use client";

import { Card, CardBody, CardFooter } from "@heroui/card";
import { Image } from "@heroui/image";
import { TrashIcon } from "@/components/icons";
import { Button } from "@heroui/button";

export default function ItemTile({
  name,
  image,
}: {
  name: string;
  image: string;
}) {
  return (
    <Card key={name} shadow="md" className="mb-4 break-inside-avoid">
      <CardBody className="overflow-visible p-0">
        <Image
          alt={name}
          className="w-full object-cover rounded-b-none"
          radius="lg"
          shadow="sm"
          src={`data:image/png;base64,${image}`}
          width="100%"
        />
      </CardBody>
      <CardFooter className="flex justify-between">
        <span className="font-semibold">{name}</span>
        <Button isIconOnly variant="light" className="text-red-500">
          <TrashIcon />
        </Button>
      </CardFooter>
    </Card>
  );
}
