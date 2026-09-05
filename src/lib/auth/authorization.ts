import type { NextRequest } from "next/server";
import {
  getAuthenticatedSession,
  SESSION_COOKIE_NAME,
  type AuthenticatedSession,
} from "@/lib/auth/session";
import { isRoleAllowed, type AuthRole } from "@/lib/auth/roles";

export type UserRole = AuthenticatedSession["user"]["role"];

export type AuthorizationResult =
  | { ok: true; session: AuthenticatedSession }
  | { ok: false; reason: "UNAUTHENTICATED" | "FORBIDDEN" };

function isTeacherStudentManagementRequest(request: NextRequest): boolean {
  const pathname = request.nextUrl.pathname;
  const method = request.method.toUpperCase();

  if (method === "GET") {
    return pathname === "/api/v1/admin/students" || pathname === "/api/v1/admin/student-devices";
  }

  if (method === "POST") {
    return (
      pathname === "/api/v1/admin/students" ||
      pathname === "/api/v1/admin/subscriptions" ||
      pathname === "/api/v1/admin/users/password"
    );
  }

  if (method === "PATCH") {
    return (
      /^\/api\/v1\/admin\/students\/[^/]+$/.test(pathname) ||
      /^\/api\/v1\/admin\/subscriptions\/[^/]+$/.test(pathname)
    );
  }

  if (method === "DELETE") {
    return (
      /^\/api\/v1\/admin\/students\/[^/]+$/.test(pathname) ||
      /^\/api\/v1\/admin\/students\/[^/]+\/device$/.test(pathname)
    );
  }

  return false;
}

export async function authorizeRequest(
  request: NextRequest,
  allowedRoles?: readonly UserRole[],
): Promise<AuthorizationResult> {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return { ok: false, reason: "UNAUTHENTICATED" };
  }

  const session = await getAuthenticatedSession(token);

  if (!session) {
    return { ok: false, reason: "UNAUTHENTICATED" };
  }

  const normallyAllowed = isRoleAllowed(session.user.role as AuthRole, allowedRoles);
  const teacherStudentManagementAllowed =
    session.user.role === "TEACHER" &&
    Boolean(allowedRoles?.includes("ADMIN")) &&
    isTeacherStudentManagementRequest(request);

  if (!normallyAllowed && !teacherStudentManagementAllowed) {
    return { ok: false, reason: "FORBIDDEN" };
  }

  return { ok: true, session };
}
