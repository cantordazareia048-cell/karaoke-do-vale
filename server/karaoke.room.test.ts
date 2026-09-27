import { describe, expect, it } from "vitest";
import { addComment, addSong, closeRoom, createRoom, getRoom, joinRoom, rateSong, searchYouTube, sendReaction } from "./karaoke";

describe("durable karaoke rooms", () => {
  it("keeps the same room available after a join and reload", async () => {
    const created = await createRoom();
    const joined = await joinRoom(created.code, "Teste");
    const result = (await searchYouTube("Evidências karaokê"))[0];
    expect(result).toBeTruthy();
    const song = {
      videoId: result!.videoId,
      title: result!.title,
      channel: result!.channel,
      thumbnail: result!.thumbnail,
      duration: result!.duration,
      addedBy: joined.participant.name,
    };
    await addSong(created.code, song);
    const reloaded = await getRoom(created.code);
    expect(reloaded?.code).toBe(created.code);
    expect(reloaded?.participants[0]?.name).toBe("Teste");
    expect(reloaded?.nowPlaying?.videoId).toBe(result!.videoId);
    await sendReaction(created.code, "❤️", joined.participant.name);
    await rateSong(created.code, result!.videoId, 5, joined.participant.name);
    await addComment(created.code, result!.videoId, "Mandou muito bem!", joined.participant.name);
    const feedback = await getRoom(created.code);
    expect(feedback?.reactions[0]?.emoji).toBe("❤️");
    expect(feedback?.reactions[0]?.singer).toBe(joined.participant.name);
    expect(feedback?.ratings[0]?.value).toBe(5);
    expect(feedback?.comments[0]?.text).toBe("Mandou muito bem!");
    await closeRoom(created.code);
  }, 20000);
});
