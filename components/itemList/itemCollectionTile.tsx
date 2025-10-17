"use client";

import { Card, CardBody, CardFooter } from "@heroui/card";
import { Image } from "@heroui/image";
import clsx from "clsx";
import Link from "next/link";

export default function ItemCollectionTile({
  items,
  name,
  id,
}: {
  items: {
    image: string;
  }[];
  name: string;
  id: string;
}) {
  return (
    <Link href={`/collection/${id}`}>
      <Card
        shadow="md"
        className={clsx(
          "break-inside-avoid hover:scale-[102%] group cursor-pointer w-full",
          items.length === 2 && "aspect-square"
        )}
        isPressable
      >
        <CardBody
          className={clsx(
            "overflow-visible p-2 grid gap-2 rounded-b-none",
            items.length === 1 && "grid-cols-1",
            items.length === 2 && "grid-cols-2 grid-rows-2",
            items.length >= 3 && "grid-cols-2 grid-rows-2"
          )}
        >
          {items.slice(0, 4).map(({ image }, i) => (
            <Image
              key={name + i}
              className="object-cover w-full h-full"
              classNames={{
                wrapper: items.length === 2 && "row-span-full",
              }}
              radius="none"
              shadow="sm"
              src={`data:image/webp;base64,${image}`}
              width="100%"
            ></Image>
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
