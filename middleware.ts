import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { Role } from "@/lib/core/user";
import { locales, localeFromRequest } from "@/lib/i18n";

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"],
};

export function middleware(request: NextRequest) {
  const isAdminRoute = /^\/admin(\/.*)?$/.test(request.nextUrl.pathname);
  const isUserRoute = /^\/user(\/.*)?$/.test(request.nextUrl.pathname);

  if (isAdminRoute) {
    // @ts-ignore
    return auth((req) => {
      if (!req.auth) {
        const newUrl = new URL("/api/auth/signin", req.nextUrl.origin);
        return Response.redirect(newUrl);
      }

      if (req.auth.user.role !== Role.ADMIN) {
        const newUrl = new URL("/", req.nextUrl.origin);
        return Response.redirect(newUrl);
      }
    })(request);
  }

  if (isUserRoute) {
    // @ts-ignore
    return auth((req) => {
      if (!req.auth) {
        const newUrl = new URL("/api/auth/signin", req.nextUrl.origin);
        return Response.redirect(newUrl);
      }
    })(request);
  }

  const { pathname } = request.nextUrl;
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (pathnameHasLocale) return;

  const locale = localeFromRequest(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}
