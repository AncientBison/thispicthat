import { auth } from "@/auth";
import { SignInButton } from "@/components/signInButton";
import { redirect } from "next/navigation";

export default async function SignIn() {
  const session = await auth();

  if (session) {
    redirect("/");
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-6xl font-semibold mb-4">Welcome to ThisPicThat!</h1>
        <p className="mb-6">
          Please sign in to start your journey.
        </p>
        <SignInButton />
      </div>
    </>
  );
}
