"use client";

import { Card, CardBody, CardFooter } from "@heroui/card";
import { Image } from "@heroui/image";
import clsx from "clsx";
import Link from "next/link";

export default function ItemCollectionTile({
  previewItems,
  name,
  id,
}: {
  previewItems: {
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
          "break-inside-avoid hover:scale-[102%] group cursor-pointer w-full max-h-screen",
          previewItems.length === 2 && "aspect-square"
        )}
        isPressable
      >
        <CardBody
          className={clsx(
            "overflow-visible p-2 grid gap-2 rounded-b-none",
            previewItems.length === 1 && "grid-cols-1",
            previewItems.length === 2 && "grid-cols-2 grid-rows-2",
            previewItems.length >= 3 && "grid-cols-2 grid-rows-2"
          )}
        >
          {previewItems.slice(0, 4).map(({ image }, i) => (
            <Image
              key={name + i}
              className="object-cover w-full h-full"
              classNames={{
                wrapper: clsx(
                  previewItems.length === 2 && "row-span-full",
                  previewItems.length !== 2 && "aspect-square"
                ),
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
          <span className="text-neutral-500">{previewItems.length} items</span>
        </CardFooter>
      </Card>
    </Link>
  );
}
