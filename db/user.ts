"use server";

import { auth } from "@/auth";
import db from "@/db";
import { createDefaultCollectionsForUser } from "@/db/default/collectionCreator";
import { userSettings } from "@/db/schema";
import { Locale } from "@/i18n/config";

export async function getUserIdOrThrow() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User not authenticated");
  }

  return userId;
}

export async function getUserSettings() {
  const userId = await getUserIdOrThrow();

  const settings = await db.query.userSettings.findFirst({
    where: (settings, { eq }) => eq(settings.userId, userId),
  });

  if (!settings) {
    throw new Error("User settings not found");
  }

  return settings;
}

export async function setUserSettings(
  nativeLanguage: Locale,
  learningLanguage: Locale
) {
  const userId = await getUserIdOrThrow();

  try {
    await db
      .insert(userSettings)
      .values([{ userId, nativeLanguage, learningLanguage }])
      .onConflictDoUpdate({
        target: userSettings.userId,
        set: { nativeLanguage, learningLanguage },
      });

    await createDefaultCollectionsForUser(userId, learningLanguage, nativeLanguage);
  } catch (error) {
    console.error("Failed to set user settings:", error);
    throw new Error("Failed to set user settings", { cause: error });
  }
}
