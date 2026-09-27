import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const karaokeRooms = mysqlTable("karaokeRooms", {
  id: varchar("id", { length: 32 }).primaryKey(),
  code: varchar("code", { length: 8 }).notNull().unique(),
  hostToken: varchar("hostToken", { length: 80 }).notNull(),
  status: mysqlEnum("status", ["active", "closed"]).default("active").notNull(),
  state: text("state").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type KaraokeRoom = typeof karaokeRooms.$inferSelect;
export type InsertKaraokeRoom = typeof karaokeRooms.$inferInsert;
