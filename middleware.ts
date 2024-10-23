import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import authConfig from "./auth.config";
import { NextAuthRequest } from "./node_modules/next-auth/lib/index.d";
import {
    apiAuthPrefix,
    authRouters,
    DEFAUTL_LOGIN_REDIRECT,
    publicRoutes,
} from "./routes";

const { auth } = NextAuth(authConfig);

export default auth((req: NextAuthRequest) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;
    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRouters.includes(nextUrl.pathname);

    if (isApiAuthRoute) {
        return;
    }

    if (isAuthRoute) {
        if (isLoggedIn) {
            return NextResponse.rewrite(
                new URL(DEFAUTL_LOGIN_REDIRECT, nextUrl),
            );
        }
        return;
    }

    if (!isPublicRoute && !isLoggedIn) {
        let callbackUrl = nextUrl.pathname;

        if (nextUrl.search) {
            callbackUrl += nextUrl.search;
        }

        const encodeCallbackUrl = encodeURIComponent(callbackUrl);

        return NextResponse.redirect(
            new URL(`/auth/login?callbackUrl=${encodeCallbackUrl}`, nextUrl),
        );
    }

    return;
});

// Optionally, don't invoke Middleware on some paths
export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
