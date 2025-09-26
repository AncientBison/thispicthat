"use client";

import {
  itemImageAtom,
  itemNameAtom,
  newItemModalOpenAtom,
  itemsAtom,
} from "@/atoms";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { useAtom, useSetAtom } from "jotai";
import { Divider } from "@heroui/divider";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import ImageUpload from "@/components/imageUpload";
import { useCallback, useState } from "react";
import { createItemEntry } from "@/db/items";
import imageCompression from "browser-image-compression";
import { addToast } from "@heroui/toast";
import { useTranslations } from "next-intl";

export default function NewItemModal() {
  const [isOpen, setIsOpen] = useAtom(newItemModalOpenAtom);
  const setName = useSetAtom(itemNameAtom);
  const setItemImage = useSetAtom(itemImageAtom);

  const t = useTranslations("NewItemModal");

  return (
    <Modal isOpen={isOpen} onOpenChange={(open: boolean) => setIsOpen(open)}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              <h1 className="font-bold text-2xl pb-4">{t("title")}</h1>
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
                placeholder={t("itemNamePlaceholder")}
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

const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });

function SubmitButton({ onClose }: { onClose: () => void }) {
  const [name] = useAtom(itemNameAtom);
  const [image] = useAtom(itemImageAtom);
  const setItems = useSetAtom(itemsAtom);
  const [loading, setLoading] = useState(false);

  const t = useTranslations("NewItemModal");

  const onClick = useCallback(async () => {
    setLoading(true);

    try {
      const processedImage = await imageCompression(image!, {
        maxSizeMB: 0.8,
        useWebWorker: true,
      });
      const id = await createItemEntry({ name, image: processedImage });
      addToast({ color: "success", title: t("itemCreated") });
      onClose();

      const imageBase64 = await toBase64(processedImage);

      setItems((items) => [...items, { name, image: imageBase64, id }]);
    } catch (error) {
      addToast({ color: "danger", title: t("errorCreatingItem") });
      onClose();
    } finally {
      setLoading(false);
    }
  }, [name, image, onClose]);

  return (
    <Button
      isDisabled={name === "" || image === null || loading}
      color="primary"
      onPress={onClick}
    >
      {loading ? <Spinner color="default" size="sm" /> : t("create")}
    </Button>
  );
}
