import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const userContext: TrpcContext = {
  user: {
    id: 2,
    openId: "regular-user",
    name: "Participante",
    email: "user@example.com",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  },
  req: { protocol: "https", headers: {} } as TrpcContext["req"],
  res: {} as TrpcContext["res"],
};

describe("admin.overview", () => {
  it("rejects a regular user", async () => {
    const caller = appRouter.createCaller(userContext);
    await expect(caller.admin.overview()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });
});
