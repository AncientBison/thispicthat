import { signIn } from "@/auth";
import { Button } from "@heroui/button";
import { useTranslations } from "next-intl";

export function SignInButton() {
  const t = useTranslations("SignIn");

  return (
    <form
      action={async () => {
        "use server";
        await signIn();
      }}
    >
      <Button type="submit" size="lg" color="primary" variant="ghost">
        {t("button")}
      </Button>
    </form>
  );
}
