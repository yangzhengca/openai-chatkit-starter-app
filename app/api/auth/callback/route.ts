import { NextRequest, NextResponse } from "next/server";
import {
    getStytchClient,
    isEmailAllowed,
    ALLOWED_EMAIL_DOMAIN,
} from "@/lib/stytch";
import { setSessionCookie, SESSION_DURATION_MINUTES } from "@/lib/auth";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get("token");
    const stytch_token_type = searchParams.get("stytch_token_type");

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    if (!token) {
        return NextResponse.redirect(
            new URL("/login?error=missing_token", baseUrl)
        );
    }

    try {
        const stytchClient = getStytchClient();

        let response;

        if (stytch_token_type === "oauth") {
            // Handle OAuth callback
            response = await stytchClient.oauth.authenticate({
                token,
                session_duration_minutes: SESSION_DURATION_MINUTES,
            });
        } else {
            // Handle magic link callback (if you want to support it later)
            response = await stytchClient.magicLinks.authenticate({
                token,
                session_duration_minutes: SESSION_DURATION_MINUTES,
            });
        }

        const email = response.user.emails[0]?.email;

        // Check if email domain is allowed
        if (!email || !isEmailAllowed(email)) {
            // Revoke the session immediately
            if (response.session_token) {
                try {
                    await stytchClient.sessions.revoke({
                        session_token: response.session_token,
                    });
                } catch (revokeError) {
                    console.error(
                        "Failed to revoke unauthorized session:",
                        revokeError
                    );
                }
            }

            return NextResponse.redirect(
                new URL(
                    `/login?error=unauthorized_domain&message=${encodeURIComponent(
                        `Only ${ALLOWED_EMAIL_DOMAIN} emails are allowed to sign in.`
                    )}`,
                    baseUrl
                )
            );
        }

        // Set session cookie
        await setSessionCookie(response.session_token);

        return NextResponse.redirect(new URL("/", baseUrl));
    } catch (error) {
        console.error("OAuth callback error:", error);
        return NextResponse.redirect(
            new URL("/login?error=authentication_failed", baseUrl)
        );
    }
}
