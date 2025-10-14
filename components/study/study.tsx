"use client";

import { useMemo, useState } from "react";
import { use } from "react";
import StudyCard from "./studyCard";
import StudyCompletion from "./studyCompletion";
import { Progress } from "@heroui/progress";

export default function Study({
  itemsPromise,
  collectionName,
}: {
  itemsPromise: Promise<{ name: string; image: string; id: string }[]>;
  collectionName?: string;
}) {
  const items = use(itemsPromise);

  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<
    "unanswered" | "correct" | "incorrect"
  >("unanswered");
  const [incorrectItems, setIncorrectItems] = useState<
    { name: string; image: string; id: string }[]
  >([]);

  const current = items[index];

  const checkAnswer = () => {
    const normalized = answer.trim().toLowerCase();
    const correct = current.name.trim().toLowerCase();

    if (normalized === correct) {
      setFeedback("correct");
      setIndex((index) => index + 1);
      setAnswer("");
      setFeedback("unanswered");
    } else {
      setFeedback("incorrect");
      setIncorrectItems((previous) => {
        if (previous.find((item) => item.id === current.id)) return previous;
        return [...previous, current];
      });
    }
  };

  const completed = useMemo(() => index >= items.length, [index, items.length]);

  if (completed) {
    return (
      <StudyCompletion
        incorrectItems={incorrectItems}
        collectionName={collectionName}
      />
    );
  }

  return (
    <>
      <Progress
        value={(index / items.length) * 100}
        radius="none"
        color="success"
      />
      <div className="max-w-3xl mx-auto p-4 flex-grow flex flex-col justify-center">
        <div className="flex flex-col items-center justify-center gap-4">
          <StudyCard
            item={current}
            answer={answer}
            setAnswer={setAnswer}
            onCheck={checkAnswer}
            feedback={feedback}
          />

          <div className="mt-4 w-full flex justify-between items-center">
            <div className="text-sm text-neutral-600">
              {index} / {items.length}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
