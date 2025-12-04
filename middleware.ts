import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE_NAME = "stytch_session";

// Routes that don't require authentication
const publicRoutes = ["/login", "/api/auth"];

function isPublicRoute(pathname: string): boolean {
    return publicRoutes.some(
        (route) => pathname === route || pathname.startsWith(route + "/")
    );
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow public routes
    if (isPublicRoute(pathname)) {
        return NextResponse.next();
    }

    // Allow static files and Next.js internals
    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/static") ||
        pathname.includes(".") // files with extensions (images, etc.)
    ) {
        return NextResponse.next();
    }

    // Check for session cookie
    const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionToken) {
        // Redirect to login if no session
        const loginUrl = new URL("/login", request.url);
        return NextResponse.redirect(loginUrl);
    }

    // Session exists, allow request
    // Note: Full session validation happens in the API routes
    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        "/((?!_next/static|_next/image|favicon.ico|public/).*)",
    ],
};
