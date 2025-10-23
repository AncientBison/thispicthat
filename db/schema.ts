import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  customType,
  pgEnum,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "@auth/core/adapters";
import { relations } from "drizzle-orm";
import { locales } from "@/i18n/config";

export const language = pgEnum("language", locales);

export const image = customType<{
  data: Buffer;
  driverData: Buffer;
}>({
  dataType() {
    return "bytea";
  },
  fromDriver(value) {
    if (typeof value === "string") {
      return Buffer.from(value, "hex");
    }

    return value;
  },
  toDriver(value: Buffer) {
    return value;
  },
});

export const collections = pgTable("collection", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  userId: text("userId").references(() => users.id, { onDelete: "cascade" }),
  language: language("language"),
  createdAt: timestamp("createdAt", { mode: "date", withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const collectionsRelations = relations(collections, ({ many }) => ({
  collectionItems: many(collectionItems),
}));

export const items = pgTable("item", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId").references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  image: image("image").notNull(),
  language: language("language"),
  createdAt: timestamp("createdAt", { mode: "date", withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const itemsRelations = relations(items, ({ many }) => ({
  collectionItems: many(collectionItems),
}));

export const collectionItems = pgTable(
  "collection_items",
  {
    collectionId: text("collection_id")
      .notNull()
      .references(() => collections.id, { onDelete: "cascade" }),
    itemId: text("item_id")
      .notNull()
      .references(() => items.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.collectionId, t.itemId] })]
);

export const collectionItemsRelations = relations(
  collectionItems,
  ({ one }) => ({
    collection: one(collections, {
      fields: [collectionItems.collectionId],
      references: [collections.id],
    }),
    item: one(items, {
      fields: [collectionItems.itemId],
      references: [items.id],
    }),
  })
);

export const userSettings = pgTable("userSettings", {
  userId: text("userId")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  nativeLanguage: language("nativeLanguage").notNull(),
  learningLanguage: language("learningLanguage").notNull(),
});

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ]
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => [
    {
      compositePk: primaryKey({
        columns: [verificationToken.identifier, verificationToken.token],
      }),
    },
  ]
);

export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => [
    {
      compositePK: primaryKey({
        columns: [authenticator.userId, authenticator.credentialID],
      }),
    },
  ]
);
