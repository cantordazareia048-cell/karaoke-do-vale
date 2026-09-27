import { describe, expect, it } from "vitest";
import { searchYouTube } from "./karaoke";

describe("YouTube karaoke search", () => {
  it("returns a real video result with a thumbnail", async () => {
    const results = await searchYouTube("Evidências karaokê");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]?.videoId).toBeTruthy();
    expect(results[0]?.thumbnail).toMatch(/^https?:\/\//);
  }, 20000);
});
