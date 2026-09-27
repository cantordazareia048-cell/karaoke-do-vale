import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";
import { karaokeRooms } from "../drizzle/schema";
import { getDb } from "./db";

type Song = { id: string; videoId: string; title: string; channel: string; thumbnail: string; duration: string; addedBy: string };
type Participant = { id: string; name: string; role: "admin" | "participant"; joinedAt: number };
type RoomState = { participants: Participant[]; queue: Song[]; nowPlaying: Song | null; history: Song[]; lastFinished: Song | null; reactions: Array<{ emoji: string; from: string; singer: string; at: number }>; ratings: Array<{ songId: string; value: number; from: string; singer: string }>; comments: Array<{ songId: string; text: string; from: string; singer: string; at: number }>; isPlaying: boolean; volume: number };
type Room = { id: string; code: string; hostToken: string; status: "active" | "closed"; createdAt: number; updatedAt: number } & RoomState;

const fallbackRooms = new Map<string, Room>();

function normalizeCode(code: string) { return code.trim().toUpperCase(); }
function newCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  do code = Array.from({ length: 5 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join(""); while (fallbackRooms.has(code));
  return code;
}
function emptyState(): RoomState { return { participants: [], queue: [], nowPlaying: null, history: [], lastFinished: null, reactions: [], ratings: [], comments: [], isPlaying: false, volume: 76 }; }
function advance(room: Room) { if (!room.nowPlaying && room.queue.length > 0) { room.nowPlaying = room.queue.shift() ?? null; room.isPlaying = Boolean(room.nowPlaying); } }
function snapshot(room: Room) { return { id: room.id, code: room.code, hostToken: room.hostToken, status: room.status, createdAt: room.createdAt, updatedAt: room.updatedAt, participants: room.participants, queue: room.queue, nowPlaying: room.nowPlaying, lastFinished: room.lastFinished, reactions: room.reactions, ratings: room.ratings, comments: room.comments, isPlaying: room.isPlaying, volume: room.volume }; }
async function persist(room: Room) {
  const db = await getDb();
  if (!db) { fallbackRooms.set(room.code, room); return; }
  const state = JSON.stringify({ participants: room.participants, queue: room.queue, nowPlaying: room.nowPlaying, history: room.history, lastFinished: room.lastFinished, reactions: room.reactions, ratings: room.ratings, comments: room.comments, isPlaying: room.isPlaying, volume: room.volume });
  await db.insert(karaokeRooms).values({ id: room.id, code: room.code, hostToken: room.hostToken, status: room.status, state, createdAt: new Date(room.createdAt), updatedAt: new Date(room.updatedAt) }).onDuplicateKeyUpdate({ set: { status: room.status, state, updatedAt: new Date(room.updatedAt) } });
}
async function loadRoom(code: string) {
  const normalized = normalizeCode(code);
  const db = await getDb();
  if (!db) return fallbackRooms.get(normalized) ?? null;
  const rows = await db.select().from(karaokeRooms).where(eq(karaokeRooms.code, normalized)).limit(1);
  const row = rows[0];
  if (!row) return null;
  let state: RoomState;
  try { state = { ...emptyState(), ...(JSON.parse(row.state) as Partial<RoomState>) }; } catch { state = emptyState(); }
  return { id: row.id, code: row.code, hostToken: row.hostToken, status: row.status, createdAt: row.createdAt.getTime(), updatedAt: row.updatedAt.getTime(), ...state } satisfies Room;
}
async function requireRoom(code: string) { const room = await loadRoom(code); if (!room || room.status !== "active") throw new Error("Sala não encontrada ou encerrada"); return room; }

export async function createRoom() {
  const room: Room = { id: nanoid(12), code: newCode(), hostToken: nanoid(32), status: "active", createdAt: Date.now(), updatedAt: Date.now(), ...emptyState() };
  await persist(room);
  return snapshot(room);
}
export async function getRoom(code: string) { const room = await loadRoom(code); if (!room || room.status !== "active") return null; advance(room); await persist(room); return snapshot(room); }
export async function joinRoom(code: string, name: string) { const room = await requireRoom(code); const cleanName = name.trim().slice(0, 32); if (!cleanName) throw new Error("Digite seu nome para entrar"); const participant: Participant = { id: nanoid(10), name: cleanName, role: room.participants.length === 0 ? "admin" : "participant", joinedAt: Date.now() }; room.participants.push(participant); room.updatedAt = Date.now(); await persist(room); return { participant, room: snapshot(room) }; }
export async function addSong(code: string, song: Omit<Song, "id">) { const room = await requireRoom(code); room.queue.push({ ...song, id: nanoid(10) }); advance(room); room.updatedAt = Date.now(); await persist(room); return snapshot(room); }
export async function removeSong(code: string, songId: string) { const room = await requireRoom(code); room.queue = room.queue.filter((song) => song.id !== songId); room.updatedAt = Date.now(); await persist(room); return snapshot(room); }
export async function controlRoom(code: string, action: "play" | "pause" | "next" | "previous" | "volume", volume?: number) { const room = await requireRoom(code); if (action === "play") room.isPlaying = true; if (action === "pause") room.isPlaying = false; if (action === "volume") room.volume = Math.max(0, Math.min(100, Math.round(volume ?? room.volume))); if (action === "next") { if (room.nowPlaying) { room.history.unshift(room.nowPlaying); room.lastFinished = room.nowPlaying; } room.nowPlaying = room.queue.shift() ?? null; room.isPlaying = Boolean(room.nowPlaying); } if (action === "previous") { const previous = room.history.shift(); if (previous) { if (room.nowPlaying) room.queue.unshift(room.nowPlaying); room.nowPlaying = previous; room.isPlaying = true; } } room.updatedAt = Date.now(); await persist(room); return snapshot(room); }
export async function sendReaction(code: string, emoji: string, from: string) { const room = await requireRoom(code); room.reactions.unshift({ emoji, from: from.slice(0, 32), singer: room.nowPlaying?.addedBy ?? "Sala", at: Date.now() }); room.reactions = room.reactions.slice(0, 40); room.updatedAt = Date.now(); await persist(room); return snapshot(room); }
export async function rateSong(code: string, songId: string, value: number, from: string) { const room = await requireRoom(code); const target = [room.nowPlaying, room.lastFinished, ...room.history].find((song) => song?.id === songId); const singer = target?.addedBy ?? "Sala"; room.ratings = room.ratings.filter((rating) => !(rating.songId === songId && rating.from === from)); room.ratings.push({ songId, value: Math.max(1, Math.min(5, Math.round(value))), from: from.slice(0, 32), singer }); room.updatedAt = Date.now(); await persist(room); return snapshot(room); }
export async function addComment(code: string, songId: string, text: string, from: string) { const room = await requireRoom(code); const cleanText = text.trim().slice(0, 180); if (!cleanText) throw new Error("Escreva um comentário"); const target = [room.nowPlaying, room.lastFinished, ...room.history].find((song) => song?.id === songId); room.comments.unshift({ songId, text: cleanText, from: from.slice(0, 32), singer: target?.addedBy ?? "Sala", at: Date.now() }); room.comments = room.comments.slice(0, 80); room.updatedAt = Date.now(); await persist(room); return snapshot(room); }
export async function closeRoom(code: string) { const room = await requireRoom(code); room.status = "closed"; room.updatedAt = Date.now(); await persist(room); return snapshot(room); }

export async function searchYouTube(query: string) {
  const cleanQuery = query.trim().slice(0, 80);
  if (!cleanQuery) return [];
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) throw new Error("A busca do YouTube precisa da chave YOUTUBE_API_KEY configurada no projeto.");
  const searchUrl = new URL("https://www.googleapis.com/youtube/v3/search");
  searchUrl.searchParams.set("part", "snippet"); searchUrl.searchParams.set("q", `${cleanQuery} karaokê`); searchUrl.searchParams.set("type", "video"); searchUrl.searchParams.set("videoEmbeddable", "true"); searchUrl.searchParams.set("maxResults", "10"); searchUrl.searchParams.set("key", apiKey);
  const response = await fetch(searchUrl);
  if (!response.ok) throw new Error("Não foi possível pesquisar no YouTube agora. Verifique a chave e a quota da API.");
  const payload = await response.json() as { items?: Array<{ id?: { videoId?: string }; snippet?: { title?: string; channelTitle?: string; thumbnails?: { medium?: { url?: string }; high?: { url?: string } } } }> };
  return (payload.items ?? []).filter((item) => item.id?.videoId).map((item) => ({ videoId: item.id!.videoId!, title: item.snippet?.title ?? "Vídeo sem título", channel: item.snippet?.channelTitle ?? "YouTube", thumbnail: item.snippet?.thumbnails?.high?.url ?? item.snippet?.thumbnails?.medium?.url ?? `https://i.ytimg.com/vi/${item.id!.videoId}/hqdefault.jpg`, duration: "--:--" }));
}
