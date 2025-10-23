import { auth } from "@/auth";
import { SignInButton } from "@/components/signInButton";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

export default async function SignIn() {
  const session = await auth();

  const t = await getTranslations("SignIn");

  if (session) {
    redirect("/");
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-6xl font-semibold mb-4">{t("welcome")}</h1>
        <p className="mb-6">{t("prompt")}</p>
        <SignInButton />
      </div>
    </>
  );
}
