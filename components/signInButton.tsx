import { signIn } from "@/auth";
import { Button } from "@heroui/button";

export function SignInButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn();
      }}
    >
      <Button type="submit" size="lg" color="primary" variant="ghost">
        Sign in
      </Button>
    </form>
  );
}
