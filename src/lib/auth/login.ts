import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { normalizeMoroccanPhone } from "@/lib/auth/phone";
import { verifyPassword } from "@/lib/auth/password";

export type SafeLoginUser = {
  id: string;
  fullName: string;
  phone: string;
  role: "STUDENT" | "PARENT" | "TEACHER" | "ADMIN";
  status: "ACTIVE" | "DISABLED";
  preferredLanguage: "ar" | "fr";
};

export type LoginResult =
  | { ok: true; user: SafeLoginUser }
  | {
      ok: false;
      reason: "INVALID_INPUT" | "INVALID_CREDENTIALS" | "ACCOUNT_DISABLED";
    };

export async function authenticateWithPhoneAndPassword(
  phoneInput: string,
  password: string,
): Promise<LoginResult> {
  const phone = normalizeMoroccanPhone(phoneInput);

  if (!phone || typeof password !== "string" || password.length === 0) {
    return { ok: false, reason: "INVALID_INPUT" };
  }

  const [user] = await db
    .select({
      id: users.id,
      fullName: users.fullName,
      phone: users.phone,
      passwordHash: users.passwordHash,
      role: users.role,
      status: users.status,
      preferredLanguage: users.preferredLanguage,
    })
    .from(users)
    .where(eq(users.phone, phone))
    .limit(1);

  if (!user) {
    return { ok: false, reason: "INVALID_CREDENTIALS" };
  }

  const passwordMatches = await verifyPassword(password, user.passwordHash);

  if (!passwordMatches) {
    return { ok: false, reason: "INVALID_CREDENTIALS" };
  }

  if (user.status !== "ACTIVE") {
    return { ok: false, reason: "ACCOUNT_DISABLED" };
  }

  await db
    .update(users)
    .set({
      lastLoginAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(users.id, user.id));

  return {
    ok: true,
    user: {
      id: user.id,
      fullName: user.fullName,
      phone: user.phone,
      role: user.role,
      status: user.status,
      preferredLanguage: user.preferredLanguage,
    },
  };
}
