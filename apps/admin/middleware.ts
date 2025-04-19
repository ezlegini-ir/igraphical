import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const { nextUrl, cookies } = req;
  const token = cookies.get("authjs.session-token")?.value;
  const isLoggedIn = !!token;

  const isPrivateRoute = ["/"].some((route) =>
    nextUrl.pathname.startsWith(route)
  );
  const isAuthRoute = ["/login"].some((route) =>
    nextUrl.pathname.startsWith(route)
  );

  if (!isLoggedIn && isPrivateRoute && !isAuthRoute) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  return NextResponse.next();
}

export const matcher = ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"];

export const loginPageRoute = "/login";
