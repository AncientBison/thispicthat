"use client";

import { useTranslations } from "next-intl";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Form } from "@heroui/form";
import { Image } from "@heroui/image";

export default function StudyCard({
  item,
  answer,
  setAnswer,
  onCheck,
  feedback,
}: {
  item: { name: string; image: string; id: string };
  answer: string;
  setAnswer: (v: string) => void;
  onCheck: () => void;
  feedback: "unanswered" | "correct" | "incorrect";
}) {
  const t = useTranslations("Study");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer(e.target.value);
  };
  return (
    <div className="w-full bg-neutral-100 dark:bg-neutral-800 shadow rounded p-4">
      <div className="flex justify-center">
        <Image src={`data:image/webp;base64,${item.image}`} alt={item.name} />
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
        <div className="flex gap-2 w-full">
          <Input
            value={answer}
            id="answer"
            onChange={handleChange}
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
