"use client";

import { itemImageAtom, itemNameAtom, newItemModalOpenAtom } from "@/atoms";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { Divider } from "@heroui/divider";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import ImageUpload from "@/components/imageUpload";
import { useCallback } from "react";

export default function NewItemModal() {
  const [isOpen, setIsOpen] = useAtom(newItemModalOpenAtom);
  const setName = useSetAtom(itemNameAtom);
  const setItemImage = useSetAtom(itemImageAtom);

  return (
    <Modal isOpen={isOpen} onOpenChange={(open: boolean) => setIsOpen(open)}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              <h1 className="font-bold text-2xl pb-4">Create New Item</h1>
            </ModalHeader>
            <ModalBody>
              <ImageUpload onUpload={(file) => setItemImage(file)} />
              <Divider />
              <Input
                classNames={{
                  input: "font-bold text-2xl",
                  inputWrapper: "h-auto min-h-0 py-2",
                  label: "",
                }}
                className="pb-2"
                size="lg"
                variant="faded"
                onChange={(e) => setName(e.target.value)}
                placeholder="Item Name"
              />
            </ModalBody>
            <ModalFooter className="flex flex-col gap-2">
              <Divider />
              <span className="flex gap-2 justify-end">
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <SubmitButton onClose={onClose} />
              </span>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

function SubmitButton({ onClose }: { onClose: () => void }) {
  const name = useAtomValue(itemNameAtom);
  const image = useAtomValue(itemImageAtom);

  const onClick = useCallback(() => {
    onClose();
    // Handle create action here
  }, []);

  return (
    <Button color="primary" onPress={onClick}>
      Create
    </Button>
  );
}
