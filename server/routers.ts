import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { adminProcedure } from "./_core/trpc";
import { getAdminOverview } from "./admin";
import { addComment, addSong, closeRoom, controlRoom, createRoom, getRoom, joinRoom, rateSong, removeSong, searchYouTube, sendReaction } from "./karaoke";

const roomCode = z.string().trim().min(5).max(8);
async function safe<T>(action: () => Promise<T>): Promise<T> { try { return await action(); } catch (error) { throw new TRPCError({ code: "BAD_REQUEST", message: error instanceof Error ? error.message : "Operação inválida" }); } }

export const appRouter = router({
  system: systemRouter,
  admin: router({
    overview: adminProcedure.query(() => getAdminOverview()),
  }),
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => { const cookieOptions = getSessionCookieOptions(ctx.req); ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 }); return { success: true } as const; }),
  }),
  karaoke: router({
    createRoom: publicProcedure.mutation(() => createRoom()),
    getRoom: publicProcedure.input(z.object({ code: roomCode })).query(async ({ input }) => { const room = await getRoom(input.code); if (!room) throw new TRPCError({ code: "NOT_FOUND", message: "Sala não encontrada" }); return room; }),
    joinRoom: publicProcedure.input(z.object({ code: roomCode, name: z.string().trim().min(1).max(32) })).mutation(({ input }) => safe(() => joinRoom(input.code, input.name))),
    search: publicProcedure.input(z.object({ query: z.string().trim().min(1).max(80) })).query(({ input }) => safe(() => searchYouTube(input.query))),
    addSong: publicProcedure.input(z.object({ code: roomCode, videoId: z.string().min(1).max(120), title: z.string().min(1).max(240), channel: z.string().min(1).max(160), thumbnail: z.string().url(), duration: z.string().max(16), addedBy: z.string().min(1).max(32) })).mutation(({ input }) => safe(() => addSong(input.code, input))),
    removeSong: publicProcedure.input(z.object({ code: roomCode, songId: z.string().min(1) })).mutation(({ input }) => safe(() => removeSong(input.code, input.songId))),
    reaction: publicProcedure.input(z.object({ code: roomCode, emoji: z.enum(["❤️", "🔥", "🎉", "👏"]), from: z.string().trim().min(1).max(32) })).mutation(({ input }) => safe(() => sendReaction(input.code, input.emoji, input.from))),
    rate: publicProcedure.input(z.object({ code: roomCode, songId: z.string().min(1), value: z.number().int().min(1).max(5), from: z.string().trim().min(1).max(32) })).mutation(({ input }) => safe(() => rateSong(input.code, input.songId, input.value, input.from))),
    comment: publicProcedure.input(z.object({ code: roomCode, songId: z.string().min(1), text: z.string().trim().min(1).max(180), from: z.string().trim().min(1).max(32) })).mutation(({ input }) => safe(() => addComment(input.code, input.songId, input.text, input.from))),
    control: publicProcedure.input(z.object({ code: roomCode, action: z.enum(["play", "pause", "next", "previous", "volume"]), volume: z.number().optional() })).mutation(({ input }) => safe(() => controlRoom(input.code, input.action, input.volume))),
    closeRoom: publicProcedure.input(z.object({ code: roomCode })).mutation(({ input }) => safe(() => closeRoom(input.code))),
  }),
});

export type AppRouter = typeof appRouter;
