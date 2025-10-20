"use client";

import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { Image } from "@heroui/image";
import { locales, Locale } from "@/i18n/config";
import { useCallback, useState } from "react";
import { setUserSettings } from "@/db/user";
import { Form } from "@heroui/form";
import { Spinner } from "@heroui/spinner";
import { useRouter } from "next/navigation";

export default function WelcomeCard({
  flags,
  translations,
}: {
  flags: Record<Locale, string>;
  translations: Record<
    Locale,
    {
      title: string;
      nativeLanguage: string;
      learningLanguage: string;
      continue: string;
    } & Record<Locale, string>
  >;
}) {
  const [selectedLocale, setSelectedLocale] = useState<Locale>(locales[0]);
  const [learningLanguage, setLearningLanguage] = useState<Locale>(locales[1]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const onNativeChange = useCallback((locale: Locale) => {
    document.cookie = `locale=${locale}; path=/`;
    setSelectedLocale(locale);
  }, []);

  const onLearningChange = useCallback((locale: Locale) => {
    setLearningLanguage(locale);
  }, []);

  const onSubmit = useCallback(() => {
    (async () => {
      try {
        setLoading(true);
        await setUserSettings(selectedLocale, learningLanguage);
        router.push("/");
      } catch (err) {
        console.error("Failed to save user settings:", err);
        setLoading(false);
      }
    })();
  }, []);

  function LocalesSelect({
    label,
    onChange,
    value,
    translation,
  }: {
    label: string;
    onChange: (locale: Locale) => void;
    value: Locale;
    translation: "native" | "locale";
  }) {
    return (
      <Select
        defaultSelectedKeys={[value]}
        label={label}
        disallowEmptySelection
        onChange={(e) => onChange(e.target.value as Locale)}
      >
        {locales
          .filter((locale) =>
            translation === "locale" ? locale !== selectedLocale : true
          )
          .map((locale) => (
            <SelectItem
              key={locale}
              startContent={
                <Image
                  src={flags[locale]}
                  alt={`${locale} flag`}
                  className="w-6"
                  radius="none"
                />
              }
            >
              {
                translations[
                  translation === "native" ? locale : selectedLocale
                ][locale]
              }
            </SelectItem>
          ))}
      </Select>
    );
  }

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <Card className="w-sm m-4">
        <CardHeader>
          <h1 className="text-2xl font-bold">
            {translations[selectedLocale].title}
          </h1>
        </CardHeader>
        <CardBody className="space-y-4">
          <LocalesSelect
            label={translations[selectedLocale].nativeLanguage}
            onChange={onNativeChange}
            value={selectedLocale}
            translation="native"
          />
          <LocalesSelect
            label={translations[selectedLocale].learningLanguage}
            onChange={onLearningChange}
            value={learningLanguage}
            translation="locale"
          />
        </CardBody>
        <CardFooter className="flex justify-end">
          <Button
            type="submit"
            color="primary"
            isDisabled={selectedLocale === learningLanguage}
          >
            {loading ? (
              <Spinner color="default" size="sm" />
            ) : (
              translations[selectedLocale].continue
            )}
          </Button>
        </CardFooter>
      </Card>
    </Form>
  );
}
