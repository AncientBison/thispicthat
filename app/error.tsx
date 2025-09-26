"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const t = useTranslations("Error");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>{t("errorText")}</h2>
      <button onClick={() => reset()}>{t("tryAgain")}</button>
    </div>
  );
}
