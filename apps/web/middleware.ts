import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "gg_admin_token";

export async function middleware(request: NextRequest) {
  const isLoginPage = request.nextUrl.pathname === "/admin/login";
  const token = request.cookies.get(COOKIE_NAME)?.value;

  let valid = false;
  if (token) {
    try {
      await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
      valid = true;
    } catch {
      valid = false;
    }
  }

  if (!isLoginPage && !valid) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  if (isLoginPage && valid) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
