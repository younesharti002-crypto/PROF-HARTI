import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { pool } from "@/db";

export const STUDENT_DEVICE_COOKIE_NAME = "prof_harti_device";
export const STUDENT_DEVICE_TTL_SECONDS = 60 * 60 * 24 * 365;

type DeviceRow = {
  device_token_hash: string;
};

export type StudentDeviceDecision =
  | { ok: true; enrolled: boolean; token: string | null }
  | { ok: false; reason: "DEVICE_NOT_AUTHORIZED" };

function hashDeviceToken(token: string): string {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

function isValidPresentedToken(token: string | undefined): token is string {
  return Boolean(token && token.length >= 32 && token.length <= 256);
}

function sameHash(left: string, right: string): boolean {
  const a = Buffer.from(left, "hex");
  const b = Buffer.from(right, "hex");
  return a.length === b.length && a.length > 0 && timingSafeEqual(a, b);
}

export async function authorizeOrEnrollStudentDevice(
  studentId: string,
  presentedToken: string | undefined,
  userAgent: string | null,
): Promise<StudentDeviceDecision> {
  const existing = await pool.query<DeviceRow>(
    `select device_token_hash
       from student_devices
      where student_id = $1
      limit 1`,
    [studentId],
  );

  const current = existing.rows[0];
  if (current) {
    if (!isValidPresentedToken(presentedToken)) {
      return { ok: false, reason: "DEVICE_NOT_AUTHORIZED" };
    }

    const presentedHash = hashDeviceToken(presentedToken);
    if (!sameHash(presentedHash, current.device_token_hash)) {
      return { ok: false, reason: "DEVICE_NOT_AUTHORIZED" };
    }

    await pool.query(
      `update student_devices
          set last_seen_at = now(), user_agent = $2
        where student_id = $1`,
      [studentId, userAgent?.slice(0, 1000) ?? null],
    );

    return { ok: true, enrolled: false, token: null };
  }

  const token = randomBytes(32).toString("base64url");
  const tokenHash = hashDeviceToken(token);
  const inserted = await pool.query<{ student_id: string }>(
    `insert into student_devices (student_id, device_token_hash, user_agent)
     values ($1, $2, $3)
     on conflict (student_id) do nothing
     returning student_id`,
    [studentId, tokenHash, userAgent?.slice(0, 1000) ?? null],
  );

  if (inserted.rowCount === 1) {
    return { ok: true, enrolled: true, token };
  }

  return { ok: false, reason: "DEVICE_NOT_AUTHORIZED" };
}

export function getStudentDeviceCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: STUDENT_DEVICE_TTL_SECONDS,
  };
}
