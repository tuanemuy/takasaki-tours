import { sql, relations } from "drizzle-orm";
import {
  sqliteTable,
  text,
  integer,
  real,
  primaryKey,
  unique,
} from "drizzle-orm/sqlite-core";
import type { AdapterAccountType } from "next-auth/adapters";
import { createId } from "@paralleldrive/cuid2";
import type { Locale } from "../i18n";
import type { Role } from "../core/user";
import type { TourStatus } from "../core/tour";
import type { ScheduleKind } from "../core/schedule";
import type { ApplicationStatus } from "../core/application";

const createdAt = text().notNull().default(sql`(CURRENT_TIMESTAMP)`);
const updatedAt = text()
  .notNull()
  .default(sql`(CURRENT_TIMESTAMP)`)
  .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`);
const timestamp = {
  createdAt,
  updatedAt,
};

export const users = sqliteTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
  image: text("image"),
  role: text("role").$type<Role>().default("user"),
  ...timestamp,
});

export const userRelations = relations(users, ({ one, many }) => ({
  profile: one(profiles),
  tours: many(tours),
}));

export const profiles = sqliteTable("profile", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: text("userId")
    .unique()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  thumbnailId: text().references(() => files.id, { onDelete: "set null" }),
  introduction: text(),
  ...timestamp,
});

export const accounts = sqliteTable(
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
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);

// For database session strategy
/*
export const sessions = sqliteTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
});
*/

export const verificationTokens = sqliteTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  }),
);

export const authenticators = sqliteTable(
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
    credentialBackedUp: integer("credentialBackedUp", {
      mode: "boolean",
    }).notNull(),
    transports: text("transports"),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  }),
);

export const files = sqliteTable("file", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: text().references(() => users.id, { onDelete: "cascade" }),
  path: text().unique().notNull(),
  mimeType: text().notNull(),
  aspectRatio: real(),
  ...timestamp,
});

export const fileRelations = relations(files, ({ many }) => ({
  assets: many(assets),
}));

export const assets = sqliteTable(
  "asset",
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => createId()),
    fileId: text()
      .notNull()
      .references(() => files.id),
    path: text().notNull(),
    label: text().notNull(),
    mimeType: text().notNull(),
    width: integer().notNull(),
    ...timestamp,
  },
  (table) => ({
    unique: unique().on(table.fileId, table.label),
  }),
);

export const assetRelations = relations(assets, ({ one }) => ({
  file: one(files, {
    fields: [assets.fileId],
    references: [files.id],
  }),
}));

export const tours = sqliteTable("tour", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: text()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text().notNull(),
  slug: text().notNull().unique(),
  notifyTo: text().notNull(),
  status: text().$type<TourStatus>().default("public"),
  ...timestamp,
});

export const tourRelations = relations(tours, ({ one, many }) => ({
  user: one(users),
  contents: many(tourContents),
  applications: many(applications),
  toursFiles: many(toursFiles),
  toursLocations: many(toursLocations),
}));

export const tourContents = sqliteTable(
  "tourContent",
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => createId()),
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tourId: text()
      .notNull()
      .references(() => tours.id, { onDelete: "cascade" }),
    locale: text().$type<Locale>().notNull().default("ja"),
    name: text(),
    description: text(),
    price: text(),
    duration: text(),
    meetingTime: text(),
    meetingPoint: text(),
    parking: text(),
    clothing: text(),
    minParticipants: integer(),
    maxParticipants: integer(),
    languages: text(),
    ageRestrictions: text(),
    services: text(),
    cancel: text(),
    requiredInformation: text(),
    contact: text(),
    updatedAt,
  },
  (table) => ({
    unique: unique().on(table.tourId, table.locale),
  }),
);

export const tourContentRelations = relations(
  tourContents,
  ({ one, many }) => ({
    tour: one(tours, {
      fields: [tourContents.tourId],
      references: [tours.id],
    }),
    schedules: many(schedules),
  }),
);

export const schedules = sqliteTable(
  "schedule",
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => createId()),
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tourContentId: text()
      .notNull()
      .references(() => tourContents.id),
    order: integer().notNull(),
    kind: text().$type<ScheduleKind>().default("location").notNull(),
    heading: text().notNull(),
    details: text(),
  },
  (table) => ({
    unique: unique().on(table.tourContentId, table.order),
  }),
);

export const scheduleRelations = relations(schedules, ({ one }) => ({
  tourContent: one(tourContents, {
    fields: [schedules.tourContentId],
    references: [tourContents.id],
  }),
}));

export const toursFiles = sqliteTable(
  "toursFiles",
  {
    tourId: text()
      .notNull()
      .references(() => tours.id, { onDelete: "cascade" }),
    fileId: text()
      .notNull()
      .references(() => files.id, { onDelete: "cascade" }),
    order: integer().notNull(),
  },
  (table) => ({
    compoundKey: primaryKey({ columns: [table.tourId, table.fileId] }),
    unique: unique().on(table.tourId, table.order),
  }),
);

export const toursFilesRelations = relations(toursFiles, ({ one }) => ({
  tour: one(tours, {
    fields: [toursFiles.tourId],
    references: [tours.id],
  }),
  file: one(files, {
    fields: [toursFiles.fileId],
    references: [files.id],
  }),
}));

export const locations = sqliteTable("location", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: text()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text().notNull(),
  ...timestamp,
});

export const locationRelations = relations(locations, ({ many }) => ({
  contents: many(locationContents),
  locationsFiles: many(locationsFiles),
  toursLocations: many(toursLocations),
}));

export const locationContents = sqliteTable(
  "locationContent",
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => createId()),
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    locationId: text()
      .notNull()
      .references(() => locations.id, { onDelete: "cascade" }),
    locale: text().$type<Locale>().notNull().default("ja"),
    name: text(),
    description: text(),
    mapSrc: text(),
    updatedAt,
  },
  (table) => ({
    unique: unique().on(table.locationId, table.locale),
  }),
);

export const locationContentRelations = relations(
  locationContents,
  ({ one }) => ({
    content: one(locations, {
      fields: [locationContents.locationId],
      references: [locations.id],
    }),
    user: one(users, {
      fields: [locationContents.userId],
      references: [users.id],
    }),
  }),
);

export const locationsFiles = sqliteTable(
  "locationsFiles",
  {
    locationId: text()
      .notNull()
      .references(() => locations.id, { onDelete: "cascade" }),
    fileId: text()
      .notNull()
      .references(() => files.id, { onDelete: "cascade" }),
    order: integer().notNull(),
  },
  (table) => ({
    compoundKey: primaryKey({
      columns: [table.locationId, table.fileId],
    }),
    unique: unique().on(table.locationId, table.order),
  }),
);

export const locationsFilesRelations = relations(locationsFiles, ({ one }) => ({
  location: one(locations, {
    fields: [locationsFiles.locationId],
    references: [locations.id],
  }),
  file: one(files, {
    fields: [locationsFiles.fileId],
    references: [files.id],
  }),
}));

export const toursLocations = sqliteTable(
  "toursLocations",
  {
    tourId: text()
      .notNull()
      .references(() => tours.id, { onDelete: "cascade" }),
    locationId: text()
      .notNull()
      .references(() => locations.id, { onDelete: "cascade" }),
    order: integer().notNull(),
  },
  (table) => ({
    compoundKey: primaryKey({
      columns: [table.tourId, table.locationId],
    }),
    unique: unique().on(table.tourId, table.order),
  }),
);

export const toursLocationsRelations = relations(toursLocations, ({ one }) => ({
  tour: one(tours, {
    fields: [toursLocations.tourId],
    references: [tours.id],
  }),
  location: one(locations, {
    fields: [toursLocations.locationId],
    references: [locations.id],
  }),
}));

export const applications = sqliteTable("application", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createId()),
  tourId: text()
    .notNull()
    .references(() => tours.id, { onDelete: "cascade" }),
  status: text().$type<ApplicationStatus>().notNull().default("new"),
  date: text().notNull(),
  representative: text().notNull(),
  participants: integer().notNull(),
  participantsDetails: text().notNull(),
  email: text().notNull(),
  tel: text(),
  remarks: text(),
  locale: text().$type<Locale>().notNull().default("ja"),
  note: text(),
  ...timestamp,
});

export const applicationRelations = relations(applications, ({ one }) => ({
  tour: one(tours, { fields: [applications.tourId], references: [tours.id] }),
}));
