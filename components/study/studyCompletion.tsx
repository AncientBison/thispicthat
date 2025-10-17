import { useTranslations } from "next-intl";
import { Button } from "@heroui/button";
import Link from "next/link";
import { Image } from "@heroui/image";
import { Divider } from "@heroui/divider";

export default function StudyCompletion({
  incorrectItems,
  collection,
}: {
  incorrectItems?: { name: string; image: string; id: string }[];
  collection?: { id: string; name: string };
}) {
  const t = useTranslations("Study");

  return (
    <div className="max-w-3xl mx-auto p-6 text-center w-full">
      <h3 className="text-2xl font-semibold mb-4">{t("completionTitle")}</h3>

      <Divider />

      {incorrectItems && incorrectItems.length > 0 ? (
        <div className="space-y-4 mb-6 w-full">
          <p className="text-neutral-600 font-semibold mt-4">
            {t("incorrectSummary")}
          </p>
          <ul className="grid grid-cols-1 gap-4 mt-4 w-full">
            {incorrectItems.map((incorrectItem) => (
              <li
                key={incorrectItem.id}
                className="flex items-center gap-3 bg-neutral-50 dark:bg-neutral-900 p-3 rounded-xl w-full shadow-lg"
              >
                <Image
                  src={`data:image/webp;base64,${incorrectItem.image}`}
                  alt={incorrectItem.name}
                  className="w-full h-24 object-cover"
                />
                <div className="text-left w-full">
                  <p className="font-medium w-full">{incorrectItem.name}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-neutral-600 mb-6">{t("noIncorrect")}</p>
      )}

      <Divider />

      <div className="flex justify-evenly gap-4 mt-4">
        {collection !== undefined && (
          <Button as={Link} href="/" color="primary">
            {t("backToHome")}
          </Button>
        )}
        <Button
          as={Link}
          href={collection === undefined ? `/` : `/collection/${collection.id}`}
          color="primary"
        >
          {collection === undefined
            ? t("backToHome")
            : t("backToCollection", { collection: collection.name })}
        </Button>
      </div>
    </div>
  );
}
