import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const COOKIE_NAME = "gg_admin_token";

export interface AdminTokenPayload {
  id: string;
  email: string;
}

export function signAdminToken(payload: AdminTokenPayload) {
  return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: "7d" });
}

export function verifyAdminToken(token: string): AdminTokenPayload | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET as string) as AdminTokenPayload;
  } catch {
    return null;
  }
}

export function getAdminFromCookies(): AdminTokenPayload | null {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;
