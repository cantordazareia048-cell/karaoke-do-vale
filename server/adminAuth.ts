import { createHmac, timingSafeEqual } from "node:crypto";
import type { Response } from "express";
import { parse } from "cookie";
import { ENV } from "./_core/env";

export const ADMIN_COOKIE = "kv_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 12;

export function validateAdminCredentials(username: string, password: string) {
  const configuredUsername = process.env.ADMIN_USERNAME ?? "";
  const configuredPassword = process.env.ADMIN_PASSWORD ?? "";
  return Boolean(configuredUsername && configuredPassword && username === configuredUsername && password === configuredPassword);
}

export function billingEnabled() {
  return process.env.BILLING_ENABLED === "true";
}

export function getAdminTokenFromRequest(req: { headers: { cookie?: string } }) {
  return parse(req.headers.cookie ?? "")[ADMIN_COOKIE];
}

function sign(value: string) {
  return createHmac("sha256", ENV.cookieSecret || "development-only-secret").update(value).digest("base64url");
}

export function createAdminSession(username: string) {
  const payload = `${username}|${Date.now() + SESSION_TTL_SECONDS * 1000}`;
  return `${Buffer.from(payload).toString("base64url")}.${sign(payload)}`;
}

export function verifyAdminSession(token: string | undefined) {
  if (!token) return false;
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return false;
  try {
    const payload = Buffer.from(encoded, "base64url").toString("utf8");
    const expected = sign(payload);
    const validSignature = timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
    const [, expiresAt] = payload.split("|");
    return validSignature && Number(expiresAt) > Date.now();
  } catch {
    return false;
  }
}

export function getAdminUsername(token: string | undefined) {
  if (!verifyAdminSession(token)) return null;
  const [encoded] = token!.split(".");
  const payload = Buffer.from(encoded, "base64url").toString("utf8");
  return payload.split("|")[0] ?? null;
}

export function setAdminSessionCookie(res: Response, token: string) {
  res.cookie(ADMIN_COOKIE, token, { httpOnly: true, secure: ENV.isProduction, sameSite: "lax", maxAge: SESSION_TTL_SECONDS * 1000, path: "/" });
}

export function clearAdminSessionCookie(res: Response) {
  res.clearCookie(ADMIN_COOKIE, { httpOnly: true, secure: ENV.isProduction, sameSite: "lax", path: "/" });
}
