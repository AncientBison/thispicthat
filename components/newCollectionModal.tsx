"use client";

import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Divider } from "@heroui/divider";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { useAtom } from "jotai";
import { useTranslations } from "next-intl";
import {
  newCollectionModalOpenAtom,
  newCollectionNameAtom,
  collectionsAtom,
} from "@/atoms";
import { useSetAtom } from "jotai";
import { createCollection } from "@/db/collections";
import { Spinner } from "@heroui/spinner";

export default function NewCollectionModal() {
  const [isOpen, setIsOpen] = useAtom(newCollectionModalOpenAtom);
  const [name, setName] = useAtom(newCollectionNameAtom);
  const setCollections = useSetAtom(collectionsAtom);
  const t = useTranslations("NewCollectionModal");
  const [loading, setLoading] = useState(false);

  const handleCreate = async (onClose: () => void) => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      const created = await createCollection(name.trim());
      setCollections((prev) => [
        { id: created.id, name: created.name, items: [] },
        ...prev,
      ]);

      setName("");
      onClose();
      setIsOpen(false);
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              <h1 className="font-bold text-2xl pb-4">{t("title")}</h1>
            </ModalHeader>

            <ModalBody>
              <div className="flex flex-col gap-2">
                <Input
                  value={name}
                  classNames={{
                    input: "font-bold text-2xl",
                    inputWrapper: "h-auto min-h-0 py-2",
                    label: "",
                  }}
                  className="pb-2"
                  size="lg"
                  variant="faded"
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("placeholder")}
                />
              </div>
            </ModalBody>

            <ModalFooter className="w-full flex flex-col gap-2">
              <Divider />
              <div className="flex gap-2 justify-end">
                <Button color="danger" variant="light" onPress={onClose}>
                  {t("cancel")}
                </Button>
                <Button
                  isDisabled={!name.trim() || loading}
                  color="primary"
                  onPress={() => handleCreate(onClose)}
                >
                  {loading ? (
                    <Spinner color="default" size="sm" />
                  ) : (
                    t("create")
                  )}
                </Button>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
