"use client";

import {
  confirmDeleteModalOpenAtom,
  itemsAtom,
  itemToDeleteAtom,
} from "@/atoms";
import { Modal, ModalContent, ModalHeader, ModalFooter } from "@heroui/modal";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { Divider } from "@heroui/divider";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { useCallback, useState } from "react";
import { deleteItemEntry } from "@/db/items";
import { addToast } from "@heroui/toast";

export default function ConfirmDeleteModal() {
  const [isOpen, setIsOpen] = useAtom(confirmDeleteModalOpenAtom);
  const itemToDelete = useAtomValue(itemToDeleteAtom);

  return (
    <Modal isOpen={isOpen} onOpenChange={(open: boolean) => setIsOpen(open)}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              <h1 className="font-semibold text-2xl pb-4">
                Are you sure you want to delete{" "}
                <span className="font-bold">{itemToDelete?.name}</span>?
              </h1>
            </ModalHeader>
            <ModalFooter className="flex flex-col gap-2">
              <Divider />
              <span className="flex gap-2 justify-end">
                <Button color="default" variant="light" onPress={onClose}>
                  Close
                </Button>
                <ConfirmDeleteButton onClose={onClose} />
              </span>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

function ConfirmDeleteButton({ onClose }: { onClose: () => void }) {
  const id = useAtomValue(itemToDeleteAtom)?.id;
  const setItems = useSetAtom(itemsAtom);
  const [loading, setLoading] = useState(false);

  const onClick = useCallback(async () => {
    setLoading(true);

    try {
      if (id === undefined) {
        throw new Error("No item to delete");
      }

      await deleteItemEntry(id);
      addToast({ color: "primary", title: "Item deleted" });
      setItems((items) => items.filter((item) => item.id !== id));
      onClose();
    } catch (error) {
      addToast({ color: "danger", title: "Error deleting item" });
      onClose();
    } finally {
      setLoading(false);
    }
  }, [id, onClose]);

  return (
    <Button isDisabled={loading} color="danger" onPress={onClick}>
      {loading ? <Spinner color="default" size="sm" /> : "Delete"}
    </Button>
  );
}
