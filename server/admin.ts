import { and, count, desc, eq, gte } from "drizzle-orm";
import { karaokeRooms, users } from "../drizzle/schema";
import { getDb } from "./db";

export async function getAdminOverview() {
  const db = await getDb();
  if (!db) {
    return { users: 0, onlineUsers: 0, activeRooms: 0, totalRooms: 0, recentRooms: [] };
  }

  const onlineSince = new Date(Date.now() - 15 * 60 * 1000);
  const [userCount, onlineUserCount, activeRoomCount, roomCount, recentRooms] = await Promise.all([
    db.select({ value: count() }).from(users),
    db.select({ value: count() }).from(users).where(and(gte(users.lastSignedIn, onlineSince))),
    db.select({ value: count() }).from(karaokeRooms).where(eq(karaokeRooms.status, "active")),
    db.select({ value: count() }).from(karaokeRooms),
    db.select({ code: karaokeRooms.code, status: karaokeRooms.status, createdAt: karaokeRooms.createdAt, updatedAt: karaokeRooms.updatedAt })
      .from(karaokeRooms)
      .orderBy(desc(karaokeRooms.updatedAt))
      .limit(8),
  ]);

  return {
    users: Number(userCount[0]?.value ?? 0),
    onlineUsers: Number(onlineUserCount[0]?.value ?? 0),
    activeRooms: Number(activeRoomCount[0]?.value ?? 0),
    totalRooms: Number(roomCount[0]?.value ?? 0),
    recentRooms,
  };
}
