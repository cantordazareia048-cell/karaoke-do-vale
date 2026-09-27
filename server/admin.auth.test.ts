import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { ADMIN_COOKIE, billingEnabled, validateAdminCredentials } from "./adminAuth";

describe("admin credential configuration", () => {
  it("accepts the configured admin credentials and keeps billing off", () => {
    expect(validateAdminCredentials("neto048", "farm2514")).toBe(true);
    expect(validateAdminCredentials("wrong", "wrong")).toBe(false);
    expect(billingEnabled()).toBe(false);
  });

  it("logs in through the admin endpoint and sets a secure session cookie", async () => {
    const cookies: Array<{ name: string; value: string }> = [];
    const ctx: TrpcContext = {
      user: null,
      req: { protocol: "https", headers: {} } as TrpcContext["req"],
      res: { cookie: (name: string, value: string) => cookies.push({ name, value }) } as TrpcContext["res"],
    };
    const result = await appRouter.createCaller(ctx).admin.login({ username: "neto048", password: "farm2514" });
    expect(result).toEqual({ success: true });
    expect(cookies[0]?.name).toBe(ADMIN_COOKIE);
    expect(cookies[0]?.value).toContain(".");
  });
});
