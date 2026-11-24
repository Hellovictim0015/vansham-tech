import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const json = (body: unknown, status = 200) =>
  NextResponse.json(body, { status });

export const fail = (message: string, status = 400, extra: object = {}) =>
  NextResponse.json({ success: false, message, ...extra }, { status });

export interface AuthPayload {
  userId?: number;
  id?: number;
  role?: string;
}

export function getJwtSecret() {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error("JWT_SECRET is not set");
  return s;
}

/** Returns the decoded token or null when missing/invalid. */
export function authenticate(req: NextRequest): AuthPayload | null {
  const h = req.headers.get("authorization");
  if (!h || !h.startsWith("Bearer ")) return null;
  try {
    return jwt.verify(h.split(" ")[1], getJwtSecret()) as AuthPayload;
  } catch {
    return null;
  }
}

type Handler = (req: NextRequest, user: AuthPayload) => Promise<Response>;

/** Equivalent of the Express `protect` middleware. */
export function protect(handler: Handler) {
  return async (req: NextRequest) => {
    const user = authenticate(req);
    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized: invalid or missing token" },
        { status: 401 },
      );
    }
    try {
      return await handler(req, user);
    } catch (err) {
      console.error(`[${req.method} ${req.nextUrl.pathname}]`, err);
      return NextResponse.json(
        { success: false, message: "Internal server error" },
        { status: 500 },
      );
    }
  };
}

/** Wrapper for public routes: catches unexpected errors. */
export function handle(handler: (req: NextRequest) => Promise<Response>) {
  return async (req: NextRequest) => {
    try {
      return await handler(req);
    } catch (err) {
      console.error(`[${req.method} ${req.nextUrl.pathname}]`, err);
      return NextResponse.json(
        { success: false, message: "Internal server error" },
        { status: 500 },
      );
    }
  };
}

export async function readJson(req: NextRequest) {
  try {
    return (await req.json()) ?? {};
  } catch {
    return {};
  }
}
