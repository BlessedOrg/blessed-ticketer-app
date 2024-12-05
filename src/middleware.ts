import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get("session");
  const url = request.nextUrl;
  if (token) {
    const response = NextResponse.redirect(url.origin);
    response.cookies.set("bouncerToken", token);
    return response;
  }

  return NextResponse.next();
}