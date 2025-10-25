"use client";

import {
  collectionAddModalOpenAtom,
  itemsAtom,
  newItemModalOpenAtom,
  itemNameAtom,
  itemImageAtom,
} from "@/atoms";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Divider } from "@heroui/divider";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { Image } from "@heroui/image";
import { useTranslations } from "next-intl";
import { useAtom, useSetAtom } from "jotai";
import React, { use, useCallback, useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { setCollectionItems } from "@/db/collections";
import { AddCircleIcon } from "@/components/icons";

type Item = { id: string; name: string; image: string };
type Collection = { id: string; name: string };

export default function CollectionAddModal({
  collectionItems,
  allItemsPromise,
  collection,
}: {
  collectionItems: Item[];
  allItemsPromise: Promise<Item[]>;
  collection: Collection;
}) {
  const [isOpen, setIsOpen] = useAtom(collectionAddModalOpenAtom);
  const setLocalCollectionItems = useSetAtom(itemsAtom);
  const t = useTranslations("CollectionAddModal");

  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [initialSelectedIds, setInitialSelectedIds] = useState<Set<string>>(
    new Set()
  );

  const allItems = use(allItemsPromise);

  const [globalItems] = useAtom(itemsAtom);
  const setNewItemModalOpen = useSetAtom(newItemModalOpenAtom);
  const setName = useSetAtom(itemNameAtom);
  const setItemImage = useSetAtom(itemImageAtom);

  const mergedItems = useMemo(() => {
    const map = new Map<string, Item>();
    for (const it of allItems) map.set(it.id, it);
    for (const it of globalItems) map.set(it.id, it);
    return Array.from(map.values());
  }, [allItems, globalItems]);

  const sortedItems = useMemo(() => {
    return [...mergedItems].sort((a, b) => {
      const aSelected = initialSelectedIds.has(a.id);
      const bSelected = initialSelectedIds.has(b.id);
      if (aSelected !== bSelected) return bSelected ? 1 : -1;
      return a.name.localeCompare(b.name);
    });
  }, [mergedItems, initialSelectedIds]);

  useEffect(() => {
    const ids = new Set(collectionItems.map((item) => item.id));
    setSelectedIds(ids);
    setInitialSelectedIds(ids);
  }, [collectionItems]);

  const toggleSelection = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const openNewItemModal = useCallback(() => {
    setName("");
    setItemImage(null);
    setNewItemModalOpen(true);
  }, [setName, setItemImage, setNewItemModalOpen]);

  useEffect(() => {
    const existingServerIds = new Set(allItems.map((i) => i.id));
    for (const gi of globalItems) {
      if (!existingServerIds.has(gi.id)) {
        setSelectedIds((prev) => {
          if (prev.has(gi.id)) return prev;
          const next = new Set(prev);
          next.add(gi.id);
          return next;
        });
      }
    }
  }, [globalItems]);

  const handleSave = useCallback(
    async (onClose: () => void) => {
      setLoading(true);
      try {
        const updatedItems = await setCollectionItems(
          collection.id,
          Array.from(selectedIds)
        );
        setLocalCollectionItems(updatedItems);
        onClose();
        setIsOpen(false);
      } catch (e) {
        console.error("Failed to save collection items:", e);
      } finally {
        setLoading(false);
      }
    },
    [collection.id, selectedIds, setLocalCollectionItems, setIsOpen]
  );

  return (
    <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              <h1 className="font-bold text-2xl pb-4">{t("title")}</h1>
            </ModalHeader>

            <ModalBody className="w-full">
              <div className="max-h-80 overflow-auto">
                <NewItemRow onOpen={openNewItemModal} />
                <Divider className="my-2" />
                {sortedItems.map((item) => (
                  <ItemRow
                    key={item.id}
                    item={item}
                    selected={selectedIds.has(item.id)}
                    onToggle={toggleSelection}
                  />
                ))}
              </div>
            </ModalBody>

            <ModalFooter className="w-full flex flex-col gap-2">
              <Divider />
              <div className="flex gap-2 justify-end">
                <Button color="danger" variant="light" onPress={onClose}>
                  {t("cancel")}
                </Button>
                <Button
                  isDisabled={loading}
                  color="primary"
                  onPress={() => handleSave(onClose)}
                >
                  {loading ? <Spinner color="default" size="sm" /> : t("save")}
                </Button>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

function NewItemRow({ onOpen }: { onOpen: () => void }) {
  return (
    <div
      className={clsx(
        "flex items-center gap-3 p-2 rounded-md cursor-pointer",
        "hover:bg-gray-100 dark:hover:bg-slate-700",
        "bg-white dark:bg-slate-900"
      )}
      onClick={onOpen}
      role="button"
    >
      <div className="w-24 h-16 flex items-center justify-center rounded text-gray-500 dark:text-slate-400">
        <AddCircleIcon size="70 %" />
      </div>
      <div className="flex-1 font-medium">Create new item</div>
      <div className="w-4 h-4" />
    </div>
  );
}

function ItemRow({
  item,
  selected,
  onToggle,
}: {
  item: Item;
  selected: boolean;
  onToggle: (id: string) => void;
}) {
  return (
    <div
      className={clsx(
        "flex items-center gap-3 p-2 rounded-md cursor-pointer",
        "hover:bg-gray-100 dark:hover:bg-slate-700",
        selected
          ? "bg-blue-50 border border-blue-200 dark:bg-slate-800 dark:border-slate-700"
          : "bg-white dark:bg-slate-900"
      )}
      onClick={() => onToggle(item.id)}
      role="button"
    >
      <Image
        src={`data:image/webp;base64,${item.image}`}
        alt={item.name}
        className="w-24 h-16 object-cover rounded"
      />
      <div className="flex-1 font-medium">{item.name}</div>
      <input type="checkbox" checked={selected} readOnly className="w-4 h-4" />
    </div>
  );
}
