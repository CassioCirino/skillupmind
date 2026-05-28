import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const adminCookieName = "skillupmind_admin";

function getExpectedSessionValue() {
  return process.env.ADMIN_SESSION_TOKEN ?? "skillupmind-admin-session";
}

export function verifyAdminCredentials(username: string, password: string) {
  const expectedUser = process.env.ADMIN_USER ?? "admin";
  const expectedPassword = process.env.ADMIN_PASSWORD ?? "admin";

  return username === expectedUser && password === expectedPassword;
}

export function setAdminCookie(response: NextResponse) {
  response.cookies.set(adminCookieName, getExpectedSessionValue(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8
  });
}

export function clearAdminCookie(response: NextResponse) {
  response.cookies.set(adminCookieName, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  });
}

export function isAdminRequest(request: NextRequest) {
  return request.cookies.get(adminCookieName)?.value === getExpectedSessionValue();
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.get(adminCookieName)?.value === getExpectedSessionValue();
}
