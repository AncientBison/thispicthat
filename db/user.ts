import { auth } from "@/auth";

export async function getUserIdOrThrow() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User not authenticated");
  }

  return userId;
}
