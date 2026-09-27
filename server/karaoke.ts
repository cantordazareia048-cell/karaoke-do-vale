import { nanoid } from "nanoid";

type Song = {
  id: string;
  videoId: string;
  title: string;
  channel: string;
  thumbnail: string;
  duration: string;
  addedBy: string;
};

type Participant = {
  id: string;
  name: string;
  role: "admin" | "participant";
  joinedAt: number;
};

type Room = {
  id: string;
  code: string;
  hostToken: string;
  status: "active" | "closed";
  createdAt: number;
  updatedAt: number;
  participants: Map<string, Participant>;
  queue: Song[];
  nowPlaying: Song | null;
  history: Song[];
  isPlaying: boolean;
  volume: number;
};

const rooms = new Map<string, Room>();

const demoCatalog = [
  { videoId: "demo-1", title: "Evidências", channel: "Chitãozinho & Xororó", duration: "04:43", thumbnail: "https://i.ytimg.com/vi/6QKJxv1Y7DU/hqdefault.jpg" },
  { videoId: "demo-2", title: "Apelido Carinhoso", channel: "Gusttavo Lima", duration: "03:42", thumbnail: "https://i.ytimg.com/vi/4eVgC0mY8Jk/hqdefault.jpg" },
  { videoId: "demo-3", title: "Na Hora da Raiva", channel: "Henrique & Juliano", duration: "03:31", thumbnail: "https://i.ytimg.com/vi/VQY8GZ5qFz8/hqdefault.jpg" },
  { videoId: "demo-4", title: "Sosseguei", channel: "Jorge & Mateus", duration: "03:24", thumbnail: "https://i.ytimg.com/vi/m1Zp3W2dP7Q/hqdefault.jpg" },
  { videoId: "demo-5", title: "Largado às Traças", channel: "Zé Neto & Cristiano", duration: "03:18", thumbnail: "https://i.ytimg.com/vi/0W4nJrY2LrY/hqdefault.jpg" },
  { videoId: "demo-6", title: "Cheia de Manias", channel: "Raça Negra", duration: "04:05", thumbnail: "https://i.ytimg.com/vi/0kK1p2W4mA4/hqdefault.jpg" },
];

function normalizeCode(code: string) {
  return code.trim().toUpperCase();
}

function newCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  do {
    code = Array.from({ length: 5 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
  } while (rooms.has(code));
  return code;
}

function advance(room: Room) {
  if (!room.nowPlaying && room.queue.length > 0) {
    room.nowPlaying = room.queue.shift() ?? null;
    room.isPlaying = Boolean(room.nowPlaying);
  }
}

export function createRoom() {
  const code = newCode();
  const room: Room = {
    id: nanoid(12),
    code,
    hostToken: nanoid(32),
    status: "active",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    participants: new Map(),
    queue: [],
    nowPlaying: null,
    history: [],
    isPlaying: false,
    volume: 76,
  };
  rooms.set(code, room);
  return snapshot(room);
}

export function getRoom(code: string) {
  const room = rooms.get(normalizeCode(code));
  if (!room || room.status !== "active") return null;
  advance(room);
  return snapshot(room);
}

export function joinRoom(code: string, name: string) {
  const room = rooms.get(normalizeCode(code));
  if (!room || room.status !== "active") throw new Error("Sala não encontrada ou encerrada");
  const cleanName = name.trim().slice(0, 32);
  if (!cleanName) throw new Error("Digite seu nome para entrar");
  const participant: Participant = {
    id: nanoid(10),
    name: cleanName,
    role: room.participants.size === 0 ? "admin" : "participant",
    joinedAt: Date.now(),
  };
  room.participants.set(participant.id, participant);
  room.updatedAt = Date.now();
  return { participant, room: snapshot(room) };
}

export function addSong(code: string, song: Omit<Song, "id">) {
  const room = requireRoom(code);
  const item = { ...song, id: nanoid(10) };
  room.queue.push(item);
  advance(room);
  room.updatedAt = Date.now();
  return snapshot(room);
}

export function removeSong(code: string, songId: string) {
  const room = requireRoom(code);
  room.queue = room.queue.filter((song) => song.id !== songId);
  room.updatedAt = Date.now();
  return snapshot(room);
}

export function controlRoom(code: string, action: "play" | "pause" | "next" | "previous" | "volume", volume?: number) {
  const room = requireRoom(code);
  if (action === "play") room.isPlaying = true;
  if (action === "pause") room.isPlaying = false;
  if (action === "volume") room.volume = Math.max(0, Math.min(100, Math.round(volume ?? room.volume)));
  if (action === "next") {
    if (room.nowPlaying) room.history.unshift(room.nowPlaying);
    room.nowPlaying = room.queue.shift() ?? null;
    room.isPlaying = Boolean(room.nowPlaying);
  }
  if (action === "previous") {
    const previous = room.history.shift();
    if (previous) {
      if (room.nowPlaying) room.queue.unshift(room.nowPlaying);
      room.nowPlaying = previous;
      room.isPlaying = true;
    }
  }
  room.updatedAt = Date.now();
  return snapshot(room);
}

export function closeRoom(code: string) {
  const room = requireRoom(code);
  room.status = "closed";
  room.updatedAt = Date.now();
  return snapshot(room);
}

function requireRoom(code: string) {
  const room = rooms.get(normalizeCode(code));
  if (!room || room.status !== "active") throw new Error("Sala não encontrada ou encerrada");
  return room;
}

function snapshot(room: Room) {
  return {
    id: room.id,
    code: room.code,
    hostToken: room.hostToken,
    status: room.status,
    createdAt: room.createdAt,
    updatedAt: room.updatedAt,
    participants: Array.from(room.participants.values()),
    queue: room.queue,
    nowPlaying: room.nowPlaying,
    isPlaying: room.isPlaying,
    volume: room.volume,
  };
}

export async function searchYouTube(query: string) {
  const cleanQuery = query.trim().slice(0, 80);
  if (!cleanQuery) return [];
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (apiKey) {
    const searchUrl = new URL("https://www.googleapis.com/youtube/v3/search");
    searchUrl.searchParams.set("part", "snippet");
    searchUrl.searchParams.set("q", cleanQuery);
    searchUrl.searchParams.set("type", "video");
    searchUrl.searchParams.set("maxResults", "8");
    searchUrl.searchParams.set("key", apiKey);
    const response = await fetch(searchUrl);
    if (!response.ok) throw new Error("Não foi possível pesquisar no YouTube agora");
    const payload = await response.json() as { items?: Array<{ id?: { videoId?: string }; snippet?: { title?: string; channelTitle?: string; thumbnails?: { medium?: { url?: string } } } }> };
    return (payload.items ?? []).filter((item) => item.id?.videoId).map((item) => ({
      videoId: item.id!.videoId!,
      title: item.snippet?.title ?? "Vídeo sem título",
      channel: item.snippet?.channelTitle ?? "YouTube",
      thumbnail: item.snippet?.thumbnails?.medium?.url ?? `https://i.ytimg.com/vi/${item.id!.videoId}/hqdefault.jpg`,
      duration: "--:--",
    }));
  }
  const terms = cleanQuery.toLowerCase().split(/\s+/).filter(Boolean);
  return demoCatalog.filter((song) => terms.some((term) => `${song.title} ${song.channel}`.toLowerCase().includes(term))).slice(0, 8).length
    ? demoCatalog.filter((song) => terms.some((term) => `${song.title} ${song.channel}`.toLowerCase().includes(term))).slice(0, 8)
    : demoCatalog.slice(0, 6);
}
