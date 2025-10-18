"use client";

import {
  removeItemFromCollectionModalOpenAtom,
  itemToRemoveFromCollectionAtom,
  itemsAtom,
} from "@/atoms";
import { Modal, ModalContent, ModalHeader, ModalFooter } from "@heroui/modal";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { Divider } from "@heroui/divider";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { useCallback, useState } from "react";
import { removeItemFromCollection } from "@/db/collections";
import { addToast } from "@heroui/toast";
import { useTranslations } from "next-intl";

export default function RemoveItemFromCollectionModal() {
  const [isOpen, setIsOpen] = useAtom(removeItemFromCollectionModalOpenAtom);
  const itemToRemove = useAtomValue(itemToRemoveFromCollectionAtom);

  const t = useTranslations("RemoveItemFromCollectionModal");

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open: boolean) => setIsOpen(open)}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              <h1 className="font-semibold text-2xl pb-4">
                {t.rich("message", {
                  b: (children) => <span className="font-bold">{children}</span>,
                  item: itemToRemove?.name!,
                })}
              </h1>
            </ModalHeader>
            <ModalFooter className="flex flex-col gap-2">
              <Divider />
              <span className="flex gap-2 justify-end">
                <Button color="default" variant="light" onPress={onClose}>
                  {t("close")}
                </Button>
                <RemoveButton onClose={onClose} />
              </span>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

function RemoveButton({ onClose }: { onClose: () => void }) {
  const id = useAtomValue(itemToRemoveFromCollectionAtom)?.id;
  const collectionId = useAtomValue(itemToRemoveFromCollectionAtom)?.collectionId;
  const setItems = useSetAtom(itemsAtom);
  const [loading, setLoading] = useState(false);

  const t = useTranslations("RemoveItemFromCollectionModal");
  const tError = useTranslations("Error");

  const onClick = useCallback(async () => {
    setLoading(true);

    try {
      if (id === undefined || collectionId === undefined) {
        throw new Error("No item to remove");
      }

      await removeItemFromCollection(collectionId, id);
      addToast({ color: "primary", title: t("removed") });

      // Optionally update items list in UI if present
      setItems((items) => items.filter((item) => item.id !== id));

      onClose();
    } catch (error) {
      addToast({ color: "danger", title: tError("removeItem") });
      onClose();
    } finally {
      setLoading(false);
    }
  }, [id, collectionId, onClose, setItems, t]);

  return (
    <Button isDisabled={loading} color="warning" onPress={onClick}>
      {loading ? <Spinner color="default" size="sm" /> : t("remove")}
    </Button>
  );
}
