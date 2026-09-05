import { NextRequest, NextResponse } from "next/server";
import { authenticateWithPhoneAndPassword } from "@/lib/auth/login";
import {
  createSessionForUser,
  getSessionCookieOptions,
  SESSION_COOKIE_NAME,
} from "@/lib/auth/session";
import {
  authorizeOrEnrollStudentDevice,
  getStudentDeviceCookieOptions,
  STUDENT_DEVICE_COOKIE_NAME,
} from "@/lib/auth/student-device";

const JSON_HEADERS = {
  "Cache-Control": "no-store",
};

type LoginBody = {
  phone?: unknown;
  password?: unknown;
};

function errorResponse(
  status: number,
  code: string,
  message: string,
): NextResponse {
  return NextResponse.json(
    {
      error: {
        code,
        message,
      },
    },
    {
      status,
      headers: JSON_HEADERS,
    },
  );
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  let body: LoginBody;

  try {
    body = (await request.json()) as LoginBody;
  } catch {
    return errorResponse(400, "INVALID_REQUEST", "Invalid request body.");
  }

  if (typeof body.phone !== "string" || typeof body.password !== "string") {
    return errorResponse(400, "INVALID_REQUEST", "Phone and password are required.");
  }

  try {
    const result = await authenticateWithPhoneAndPassword(
      body.phone,
      body.password,
    );

    if (!result.ok) {
      if (result.reason === "ACCOUNT_DISABLED") {
        return errorResponse(403, "ACCOUNT_DISABLED", "This account is disabled.");
      }

      if (result.reason === "INVALID_INPUT") {
        return errorResponse(400, "INVALID_REQUEST", "Invalid phone or password format.");
      }

      return errorResponse(401, "INVALID_CREDENTIALS", "Invalid phone or password.");
    }

    let deviceTokenToSet: string | null = null;
    if (result.user.role === "STUDENT") {
      const device = await authorizeOrEnrollStudentDevice(
        result.user.id,
        request.cookies.get(STUDENT_DEVICE_COOKIE_NAME)?.value,
        request.headers.get("user-agent"),
      );

      if (!device.ok) {
        return errorResponse(
          403,
          "DEVICE_NOT_AUTHORIZED",
          "هذا الحساب مرتبط بجهاز آخر. تواصل مع الإدارة لإعادة تعيين الجهاز.",
        );
      }

      deviceTokenToSet = device.token;
    }

    const session = await createSessionForUser(result.user.id);

    const response = NextResponse.json(
      {
        data: {
          user: result.user,
          session: {
            expiresAt: session.expiresAt.toISOString(),
          },
        },
        meta: {},
      },
      {
        status: 200,
        headers: JSON_HEADERS,
      },
    );

    response.cookies.set(
      SESSION_COOKIE_NAME,
      session.token,
      getSessionCookieOptions(session.expiresAt),
    );

    if (deviceTokenToSet) {
      response.cookies.set(
        STUDENT_DEVICE_COOKIE_NAME,
        deviceTokenToSet,
        getStudentDeviceCookieOptions(),
      );
    }

    return response;
  } catch (error) {
    console.error("auth.login.failed", {
      error: error instanceof Error ? error.message : "unknown_error",
    });

    return errorResponse(500, "AUTH_UNAVAILABLE", "Login is temporarily unavailable.");
  }
}
