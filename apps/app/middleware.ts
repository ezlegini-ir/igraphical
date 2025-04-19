import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const { nextUrl, cookies } = req;
  const token = cookies.get("authjs.session-token")?.value;
  const isLoggedIn = !!token;

  const isPrivateRoute = privateRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );

  const isAuthRoute = ["/login"].some((route) =>
    nextUrl.pathname.startsWith(route)
  );

  if (!isLoggedIn && isPrivateRoute && !isAuthRoute) {
    const returnUrl = nextUrl.pathname + nextUrl.search;
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", returnUrl);

    return NextResponse.redirect(loginUrl);
  }

  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL("/panel", nextUrl));
  }

  return NextResponse.next();
}

export const matcher = ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"];

export const loginPageRoute = "/login";

export const privateRoutes = [
  "/panel",
  "/api",
  "/cart",
  "/quick-cart",
  "/classroom",
  "/checkout-result",
];
//! UPDATE THIS LIST IN NEXT_SITEMAP CONFIG FILE AS WELL.
