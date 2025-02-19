import { relations } from "drizzle-orm"
import {
  pgTable,
  text,
  timestamp,
  boolean,
  pgEnum,
  date,
  uuid,
  index,
} from "drizzle-orm/pg-core"

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
})

export type InsertUser = typeof user.$inferInsert
export type SelectUser = typeof user.$inferSelect

export const userRelations = relations(user, ({ one, many }) => ({
  patient: many(patient),
  account: many(account),
  session: many(session),
}))

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
})

export const sessionRelations = relations(session, ({ one, many }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
    relationName: "user",
  }),
}))

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
})

export const accountRelations = relations(account, ({ one, many }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
    relationName: "user",
  }),
}))

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
})

export const genderEnum = pgEnum("gender", ["male", "female", "other"])

export const patient = pgTable(
  "patient",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    dateOfBirth: date("date_of_birth").notNull(),
    ssn: text("ssn").notNull(),
    gender: genderEnum().notNull(),
    phoneNumber: text("phone_number"),
    address: text("address"),
  },
  (table) => [index("patient_user_id_index").on(table.userId)]
)

export type InsertPatient = typeof patient.$inferInsert
export type SelectPatient = typeof patient.$inferSelect

export const patientRelations = relations(patient, ({ one, many }) => ({
  user: one(user, {
    fields: [patient.userId],
    references: [user.id],
    relationName: "user",
  }),
}))

export const statusEnum = pgEnum("status", [
  "scheduled",
  "completed",
  "cancelled",
  "in_progress",
  "no_show",
])

export const appointment = pgTable("appointment", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  patientId: uuid("patient_id")
    .notNull()
    .references(() => patient.id),
  status: statusEnum().notNull(),
  date: date("date").notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  notes: text("notes"),
})

export type InsertAppointment = typeof appointment.$inferInsert
export type SelectAppointment = typeof appointment.$inferSelect

export const appointmentRelations = relations(appointment, ({ one, many }) => ({
  patient: one(patient, {
    fields: [appointment.patientId],
    references: [patient.id],
    relationName: "patient",
  }),
}))
