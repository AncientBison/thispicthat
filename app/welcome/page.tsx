import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { locales } from "@/i18n/config";
import WelcomeCard from "@/components/welcomeCard";

export default async function Home() {
  const session = await auth();

  if (!session) {
    redirect("/signin");
  }

  const flags: Record<(typeof locales)[number], string> = {
    en: (await import("@/i18n/flags/us.svg")).default.src,
    fr: (await import("@/i18n/flags/fr.svg")).default.src,
    es: (await import("@/i18n/flags/es.svg")).default.src,
  };

  const translations = {
    en: {
      title: "Welcome",
      nativeLanguage: "Native language",
      learningLanguage: "Learning language",
      continue: "Continue",
      en: "English",
      fr: "French",
      es: "Spanish",
    },
    fr: {
      title: "Bienvenue",
      nativeLanguage: "Langue maternelle",
      learningLanguage: "Langue d'apprentissage",
      continue: "Continuer",
      en: "Anglais",
      fr: "Français",
      es: "Espagnol",
    },
    es: {
      title: "Bienvenido",
      nativeLanguage: "Idioma nativo",
      learningLanguage: "Idioma de aprendizaje",
      continue: "Continuar",
      en: "Inglés",
      fr: "Francés",
      es: "Español",
    },
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <WelcomeCard flags={flags} translations={translations} />
    </div>
  );
}
