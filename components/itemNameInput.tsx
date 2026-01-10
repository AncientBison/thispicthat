"use client";

import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { Tooltip } from "@heroui/tooltip";
import { SparkleIcon, TranslateIcon } from "@/components/icons";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import imageCompression from "browser-image-compression";
import { addToast } from "@heroui/toast";
import { identifyImageSubject } from "@/ai/identifyImage";
import { Select, SelectItem } from "@heroui/select";
import { translateText } from "@/ai/translate";

export default function ItemNameInput({
  name,
  onNameChange,
  image,
  disabled = false,
}: {
  name: string;
  onNameChange: (name: string) => void;
  image: File | null;
  disabled?: boolean;
}) {
  const t = useTranslations("NewItemModal");
  const [nameLoading, setNameLoading] = useState(false);
  const [nameMode, setNameMode] = useState("ai");

  const selectModes = [
    {
      key: "ai",
      title: t("aiModeTitle"),
      description: t("aiModeDescription"),
    },
    {
      key: "translate",
      title: t("translateModeTitle"),
      description: t("translateModeDescription"),
    },
    {
      key: "manual",
      title: t("manualModeTitle"),
      description: t("manualModeDescription"),
    },
  ];

  const handleIdentify = useCallback(async () => {
    if (!image) return;

    setNameLoading(true);
    try {
      const processedImage = await imageCompression(image, {
        maxSizeMB: 0.8,
        useWebWorker: true,
        fileType: "image/webp",
      });
      const identifiedName = await identifyImageSubject(processedImage);
      onNameChange(identifiedName);
    } catch (error) {
      console.error("Identification error:", error);
      addToast({ color: "danger", title: t("identificationError") });
    } finally {
      setNameLoading(false);
    }
  }, [image, onNameChange, t]);

  const handleTranslate = useCallback(async () => {
    if (!name) return;

    setNameLoading(true);
    try {
      const translatedName = await translateText(name);
      onNameChange(translatedName);
    } catch (error) {
      console.error("Translation error:", error);
      addToast({ color: "danger", title: t("translationError") });
    } finally {
      setNameLoading(false);
    }
  }, [name, onNameChange, t]);

  return (
    <div className="flex flex-col gap-2 items-center justify-center">
      <Select
        label={t("namingMode")}
        items={selectModes}
        size="lg"
        variant="faded"
        selectedKeys={[nameMode]}
        onSelectionChange={(value) => setNameMode(value.currentKey!)}
        disallowEmptySelection
      >
        {selectModes.map((selectMode) => (
          <SelectItem
            key={selectMode.key}
            textValue={selectMode.title}
            className="flex items-center gap-2"
          >
            <div className="flex flex-col">
              <span>{selectMode.title}</span>
              <span className="text-default-500 text-tiny">
                {selectMode.description}
              </span>
            </div>
          </SelectItem>
        ))}
      </Select>
      <div className="flex items-center justify-center gap-2 w-full">
        <Input
          classNames={{
            input: "font-bold text-2xl",
            inputWrapper: "h-auto min-h-0 py-2",
            label: "",
          }}
          className="flex-1 w-full"
          size="lg"
          variant="faded"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder={t("itemNamePlaceholder")}
          isRequired
        />
        {nameMode !== "manual" && (
          <Button
            color={nameMode === "ai" ? "secondary" : "primary"}
            variant="flat"
            onPress={nameMode === "ai" ? handleIdentify : handleTranslate   }
            isDisabled={(nameMode === "ai" ? !image : !name) || nameLoading || disabled}
            isIconOnly={true}
          >
            {nameLoading ? (
              <>
                <Spinner size="sm" color="current" />
              </>
            ) : (
              <Tooltip
                content={
                  nameMode === "ai"
                    ? t("identifyWithAI")
                    : t("identifyWithTranslate")
                }
              >
                {nameMode === "ai" ? <SparkleIcon /> : <TranslateIcon />}
              </Tooltip>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
