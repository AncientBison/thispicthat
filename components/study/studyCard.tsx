"use client";

import React, { useLayoutEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Form } from "@heroui/form";
import { Image } from "@heroui/image";
import { Locale } from "@/i18n/config";

export default function StudyCard({
  item,
  answer,
  setAnswer,
  onCheck,
  feedback,
  userLearningLanguage,
}: {
  item: { name: string; image: string; id: string };
  answer: string;
  setAnswer: (v: string) => void;
  onCheck: () => void;
  feedback: "unanswered" | "correct" | "incorrect";
  userLearningLanguage: Locale;
}) {
  const t = useTranslations("Study");
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const caretPosRef = React.useRef<number | null>(null);

  const getAccents = (text: string) => {
    const accentVariants: Record<Locale, Record<string, string[]>> = {
      en: {},
      fr: {
        a: ["à", "â", "ä"],
        e: ["é", "è", "ê", "ë"],
        o: ["ô", "ö"],
        u: ["ù", "û", "ü"],
        c: ["ç"],
      },
      es: {
        a: ["á"],
        e: ["é"],
        i: ["í"],
        o: ["ó"],
        u: ["ú"],
        n: ["ñ"],
      },
    };

    const accents = new Set<string>();

    for (const character of text) {
      if (/^[\u0000-\u007f]$/.test(character)) continue;

      accents.add(character);

      const base = character.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const lowerCase = base.toLowerCase();
      const variants = accentVariants[userLearningLanguage][lowerCase];
      if (variants) {
        if (base === lowerCase) {
          for (const variant of variants) accents.add(variant);
        } else {
          for (const variant of variants) accents.add(variant.toUpperCase());
        }
      }
    }

    return Array.from(accents);
  };

  const accents = React.useMemo(() => getAccents(item.name || ""), [item.name]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer(e.target.value);
  };

  useLayoutEffect(() => {
    const el = inputRef.current;
    const pos = caretPosRef.current;
    if (el && pos !== null) {
      try {
        el.setSelectionRange(pos, pos);
      } catch (e) {}
      caretPosRef.current = null;
    }
  }, [answer]);

  return (
    <div className="w-full bg-neutral-100 dark:bg-neutral-800 shadow rounded p-4">
      <div className="flex justify-center">
        <Image
          src={`data:image/webp;base64,${item.image}`}
          alt={item.name}
          className="max-h-[calc(100vh_-_20rem)]"
        />
      </div>

      <Form
        onSubmit={(e) => {
          e.preventDefault();
          onCheck();
        }}
        autoComplete="off"
      >
        <label htmlFor="answer" className="block mb-2">
          {t("prompt")}
        </label>
        <div>
          {accents.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {accents.map((accent) => (
                <Button
                  key={accent}
                  size="md"
                  variant="faded"
                  isIconOnly
                  onPress={() => {
                    const element = inputRef.current;
                    if (!element) return setAnswer(answer + accent);
                    const start =
                      element.selectionStart ?? element.value.length;
                    const end = element.selectionEnd ?? start;
                    const newValue =
                      element.value.slice(0, start) +
                      accent +
                      element.value.slice(end);
                    setAnswer(newValue);
                    caretPosRef.current = start + accent.length;
                    element.focus();
                  }}
                >
                  {accent}
                </Button>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-2 w-full">
          <Input
            value={answer}
            id="answer"
            onChange={handleChange}
            ref={inputRef}
            placeholder={t("placeholder")}
            variant="bordered"
            size="lg"
          />
          <Button type="submit" size="lg" color="primary">
            {t("check")}
          </Button>
        </div>
      </Form>

      <div className="mt-3">
        {feedback === "correct" && (
          <div className="text-green-600 font-semibold">{t("correct")}</div>
        )}
        {feedback === "incorrect" && (
          <div className="text-red-600 font-semibold">
            {t("incorrectPrefix")}{" "}
            <span className="font-bold">{item.name}</span>
          </div>
        )}
      </div>
    </div>
  );
}
