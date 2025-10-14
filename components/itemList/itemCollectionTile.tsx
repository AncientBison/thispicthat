"use client";

import { Card, CardBody, CardFooter } from "@heroui/card";
import { Image } from "@heroui/image";
import Link from "next/link";

export default function ItemCollectionTile({
  items,
  name,
}: {
  items: {
    image: string;
  }[];
  name: string;
}) {
  return (
    <Link href={`/collection/${name}`}>
      <Card
        shadow="md"
        className="break-inside-avoid hover:scale-[102%] group cursor-pointer"
        isPressable
      >
        <CardBody className="overflow-visible p-2 grid grid-cols-2 gap-2 rounded-b-none">
          {items.slice(0, 4).map(({ image }, i) => (
            <Image
              key={name + i}
              className="object-cover w-full h-full"
              radius="none"
              shadow="sm"
              src={`data:image/webp;base64,${image}`}
              width="100%"
            />
          ))}
        </CardBody>
        <CardFooter className="flex justify-between">
          <span className="font-semibold group-hover:underline">{name}</span>
          <span className="text-neutral-500">{items.length} items</span>
        </CardFooter>
      </Card>
    </Link>
  );
}
