import { NextResponse } from "next/server";

export async function GET() {
    try {
        const publicToken = process.env.STYTCH_PUBLIC_TOKEN;

        if (!publicToken) {
            console.error("Missing STYTCH_PUBLIC_TOKEN environment variable");
            return NextResponse.redirect(
                new URL(
                    "/login?error=oauth_failed",
                    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
                )
            );
        }

        // Use Stytch's public OAuth start URL
        // For Test environment, use test.stytch.com
        // For Live environment, use api.stytch.com
        const stytchBaseUrl = process.env.STYTCH_PROJECT_ID?.includes(
            "project-test"
        )
            ? "https://test.stytch.com"
            : "https://api.stytch.com";

        const oauthStartUrl = `${stytchBaseUrl}/v1/public/oauth/google/start?public_token=${publicToken}`;

        return NextResponse.redirect(oauthStartUrl);
    } catch (error) {
        console.error("Google OAuth start error:", error);
        return NextResponse.redirect(
            new URL(
                "/login?error=oauth_failed",
                process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
            )
        );
    }
}
