import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getStytchClient } from "@/lib/stytch";
import { SESSION_COOKIE_NAME, clearSessionCookie } from "@/lib/auth";

export async function POST() {
    try {
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

        if (sessionToken) {
            try {
                const stytchClient = getStytchClient();
                await stytchClient.sessions.revoke({
                    session_token: sessionToken,
                });
            } catch (error) {
                console.error("Failed to revoke Stytch session:", error);
            }
        }

        await clearSessionCookie();

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Logout error:", error);
        return NextResponse.json({ error: "Logout failed" }, { status: 500 });
    }
}
