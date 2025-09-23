import { auth } from "@/auth";
import { SignInButton } from "@/components/signInButton";

export default async function Home() {
  const session = await auth();

  return (
    <>
      <p>
        {session
          ? `Welcome back ${session.user?.name}`
          : "You are not signed in."}
      </p>
      <SignInButton />
    </>
  );
}
